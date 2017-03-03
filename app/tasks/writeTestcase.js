var getNightwatchJSON = function(programId){
  var src_folders = "./test/"+programId+"/tests";
  var output_folder = "./test/"+programId+"/reports";
  var json = '{'+
    '"src_folders" : ["'+src_folders+'"],'+
    '"output_folder" : "'+output_folder+'",'+
    '"custom_commands_path" : "./custom/commands",'+
    '"custom_assertions_path" : "./custom/assertions",'+
    '"page_objects_path" : "",'+
    '"globals_path" : "./custom/globalsModule.js",'+
    '"live_output":true,'+
    '"test_workers":true,'+
    '"selenium" : {'+
      '"start_process" : false,'+
      '"server_path" : "./selenium/selenium-server-standalone-2.48.2.jar",'+
      '"log_path" : "",'+
      '"host" : "127.0.0.1",'+
      '"port" : 4444,'+
      '"cli_args" : {'+
      '  "webdriver.chrome.driver" : "./selenium/chromedriver.exe",'+
        '"webdriver.ie.driver" : ""'+
      '}'+
    '},'+
    '"test_settings" : {'+
      '"default" : {'+
        '"launch_url" : "http://localhost",'+
        '"selenium_port"  : 4444,'+
        '"selenium_host"  : "localhost",'+
        '"silent": true,'+
        '"screenshots" : {'+
          '"enabled" : false,'+
          '"path" : ""'+
        '},'+
        '"desiredCapabilities": {'+
          '"browserName": "firefox",'+
          '"javascriptEnabled": true,'+
          '"acceptSslCerts": true'+
        '}'+
      '}'+
    '}'+
  '}';
  return json;
}

var generateTestcase = function (id, name, element, button, url, category, program, screenshotPath){
  var buttonStepStart = '';
  var buttonStepEnd = '';
  if (button!=''){
    buttonStepStart = '\t\t.jqueryClick("'+button+'").pause(500)\n'
    buttonStepEnd = '\tbrowser.jqueryClick("'+button+'");\n'
  }
  var content = ''+
  'var fs = require("fs");\n'+
  'var settings = require("../../../settings.js");\n'+
  'module.exports = {\n'+

    '"@tags": ["'+ category +'"],\n'+

    // '"Pre Test - '+name+'": function(browser) {\n'+
    // //add pretest code here -- TODO later
    // '},\n'+
    // programID, testcaseID, testcaseName, testcaseCategory

    '"'+program+'||'+id+'||'+name+'||'+category+'": function(browser) {\n'+
      // var imageFileName = "article-detail-page_";
      'var imageFileExt = ".png";\n'+
      //var path = './screenshot/article';
      'var tolerance = settings.tolerance() || 0;\n'+
      'var env = settings.env();\n'+

      'browser\n'+
        '\t.url("'+url+'")\n'+
        '\t.waitForElementVisible("body", 1000)\n'+
        '\t.verify.jqueryElementPresent("'+element+'");\n'+

      'for (var k in env){\n'+
        '\tbrowser.resizeWindow(env[k].width, env[k].height)\n'+
          '\t\t.pause(1000)\n'+
          buttonStepStart+
          '\t\t.saveElementScreenshot("'+element+'", "'+screenshotPath+'/results/"+env[k].device+imageFileExt )\n'+
          '\t\t.verify.compareScreenshot(env[k].device+imageFileExt, "'+screenshotPath+'", tolerance);\n'+
          buttonStepEnd+
      '}\n'+
      '\tbrowser.end();\n'+
    '},\n'+

  '};\n'
  ;

  return content;
}

var writeTestcase = function (programId, programName, programBaseURL, app, type, cb) {
  // module call
  var fs = require('fs-extra');

  if (programId == undefined){
    cb(null, {"status": false, "message": "No program found"});
  }

  var Testcase = require('../models/testcase');
  var Program = require('../models/program');

  Testcase
  .find({"program":programId})
  .populate('category')
  .exec(function (err, testcases) {
    if (err) {
      cb(null, {"status": false, "message": err});
    } else {
      // console.log(testcases);
      // console.log("testcases.length > "+testcases.length);

      if (testcases.length){
        //base path : /test
        var testPath = __dirname+"/../../test/";
        var programTestPath = testPath+programId;
        var msg = '';

        //check if folder exists eg: /test/569f8e25403c4de8b7c6ce14
        //if yes, go inside and delete folder tests; eg: /test/569f8e25403c4de8b7c6ce14/tests
        fs.ensureDirSync(programTestPath);

        fs.ensureDirSync(programTestPath+'/tests'); //added to avoid the script die if folder doesnt exists
        fs.removeSync(programTestPath+'/tests');
        //if not exists create it

        if (type == 'hard') {
          fs.ensureDirSync(programTestPath+'/reports'); //added to avoid the script die if folder doesnt exists
          fs.removeSync(programTestPath+'/reports');
          fs.ensureDirSync(programTestPath+'/screenshots'); //added to avoid the script die if folder doesnt exists
          fs.removeSync(programTestPath+'/screenshots');
          msg = 'Project recreated successfully. \n';
        }
        //create folder /test/569f8e25403c4de8b7c6ce14
        //create folder /test/569f8e25403c4de8b7c6ce14/reports
        fs.ensureDirSync(programTestPath+'/reports');
        //create folder /test/569f8e25403c4de8b7c6ce14/screenshots
        fs.ensureDirSync(programTestPath+'/screenshots');
        //create folder /test/569f8e25403c4de8b7c6ce14/tests
        fs.ensureDirSync(programTestPath+'/tests');
        //create file /test/569f8e25403c4de8b7c6ce14/tests/nightwatch.json with contents

        //create symlinks // code must run as Administrator
        fs.ensureSymlink(programTestPath, testPath+programName, function (err) {
          console.log(err) // => null
          // symlink has now been created, including the directory it is to be placed in
        });

        var data = getNightwatchJSON(programId);
        fs.writeFileSync(programTestPath+'/nightwatch.json', data)

        //once all the above is ok
        //for each testcases
        // create folder category if not exists
        // create a json file with name the testcase._id.json
        // add conntent based on values in testcase
        for (var i = 0; i < testcases.length; i++) {
          var program = testcases[i].program;
          var category = testcases[i].category.name;
          //check url programBaseURL
          var url = testcases[i].url;
          if (url.search(/^http[s]?:\/\//)){
            //url in testcase does not contain http or https
            //safe remove slash at end of program url and safe remove at begining of url
            url = programBaseURL.replace(/\/$/, '')+ "/" + url.replace(/^\//, '');
          }

          var element = testcases[i].element;
          var button = testcases[i].button;
          var name = testcases[i].name;
          var id = testcases[i]._id;

          //remove space .replace(/ /g,"_"); and lowercase "Your Name".toLowerCase(); input.replace(/[^\w]/gi, '')
          var safeName = name.replace(/[^\w]/gi, '').replace(/ /g,"_").toLowerCase();
          var screenshotPath = './test/'+program+'/screenshots/'+safeName;
          var testcaseFilePath = programTestPath+'/tests/'+safeName+'/'+safeName+'.js';
          fs.ensureFileSync(testcaseFilePath);
          fs.writeFileSync(testcaseFilePath, generateTestcase(id, name, element, button, url, category, program, screenshotPath));
          //console.log("Element > "+element);
        }
        //when all the above completed, return callback. yeah!
        // console.log(">>>>> Write of "+testcases.length+" testcases successful.");
        cb(null, {"status": true, "message": msg+"Write of "+testcases.length+" testcases successful."});
      } else {
        cb(null, {"status": true, "message": "Zero testcase written; None declared!"});
      }

    }
  });

}

module.exports = writeTestcase;

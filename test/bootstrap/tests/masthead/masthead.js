var fs = require("fs");
var settings = require("../../../settings.js");

module.exports = {

  'MastHead': function(browser) {
    var imageFileName = "masthead_";
    var imageFileExt = ".png";
    var path = './screenshot/masthead';
    var element = '.bs-docs-masthead';
    var tolerance = settings.tolerance() || 0;
    var env = settings.env();

    browser
      .url('http://getbootstrap.com/')
      .waitForElementVisible('body', 1000)
      .verify.jqueryElementPresent(element);

    for (var k in env){
      browser.resizeWindow(env[k].width, env[k].height)
        .pause(1000)
        .saveElementScreenshot(element, path+'/results/'+imageFileName+env[k].device+imageFileExt )
        .verify.compareScreenshot(imageFileName+env[k].device+imageFileExt, path, tolerance);
    }
    browser.end();
  }
  
};

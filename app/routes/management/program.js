var fs = require('fs-extra');
var moment = require('moment');

module.exports = function (app) {

  var methodOverride = require('method-override'); //used to manipulate POST
  var async = require('async');

  var Program = require('../../models/program');
  var Testcase = require('../../models/testcase');
  //var Schedule = require('../../models/schedule');

  // var requireUser = require('../../controllers/require-user');

  app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

  // ALL ///////////////////////////////////////////////////////////////////////
  app.get('/management/programs/', app.auth, function (req, res) {
    //GET all programs
    var message = '';
    if(req.session.message){
      message = req.session.message;
      delete req.session.message;
    }

    res.render('management/programs/index', {
        title: 'Program Management',
        message: message
    });

  });

  // NEW ///////////////////////////////////////////////////////////////////////
  app.get('/management/programs/add', app.auth, function (req, res) {
    res.render('management/programs/add', { title: 'Add New Program' });
  });

  // NEW - POST ////////////////////////////////////////////////////////////////
  app.post('/management/programs/add', app.auth, function (req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    var name = req.body.program;
    var version = req.body.version;
    var language = req.body.language;
    var baseurl = req.body.baseurl;

    //call the create function for our database
    Program.create({
      name : name,
      version : version,
      language : language,
      baseurl : baseurl
    }, function (err, program) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        //Blob has been created
        console.log('POST creating new program: ' + program);
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
              // If it worked, set the header so the address bar doesn't still say /adduser
              res.location("management/programs");
              // And forward to success page
              res.redirect("/management/programs");
          },
          //JSON response will show the newly created program
          json: function(){
              res.json(program);
          }
        });
      }
    })
  });


  // SHOW ///////////////////////////////////////////////////////////////////////
  app.get('/management/programs/:id', app.auth, function (req, res, next) {
    console.log("request id : "+req.params.id);

    //GET current program
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        // Pass error if not found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {

        console.log('GET Retrieving ID: ' + program._id);

        var message = '';
        if(req.session.message){
          message = req.session.message;
          delete req.session.message;
        }

        res.render('management/programs/show', {
          "title" : 'Program details',
          "program" : program,
          "message": message
        });

      }

    });

  });

  // EDIT ///////////////////////////////////////////////////////////////////////
  app.get('/management/programs/:id/edit', app.auth, function (req, res, next) {
    //search for the program within Mongo
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        // Pass error if not found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //Return the program
        console.log('GET Retrieving ID: ' + program._id);
        res.format({
            //HTML response will render the 'edit.jade' template
            html: function(){
                  res.render('management/programs/edit', {
                      title: 'Edit of ' + program._id,
                      "program" : program
                  });
            },
             //JSON response will return the JSON output
            json: function(){
                  res.json(program);
            }
        });
      }
    });
  });

  app.put('/management/programs/:id/edit', app.auth, function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.program;
    var version = req.body.version;
    var language = req.body.language;
    var baseurl = req.body.baseurl;

    //find the document by ID
    Program.findById(req.params.id, function (err, program) {
      //update it
      program.update({
        name : name,
        version : version,
        language : language,
        baseurl : baseurl
      }, function (err, programID) {
        if (err) {
          res.send("There was a problem updating the information to the database: " + err);
        }
        else {
          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function(){
                  res.redirect("/management/programs/" + program._id);
            },
             //JSON responds showing the updated values
            json: function(){
                  res.json(program);
            }
          });
         }
      })
    });
  });

  app.delete('/management/programs/:id/edit', app.auth, function (req, res, next) {
    var message = '';
    //find program by ID
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        // Pass error if not found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //remove it from Mongo
        program.remove(function (err, program) {
          if (err) {
            // Pass error
            var myerr = new Error('Unable to delete record!');
            return next(myerr);
          } else {

            // TODO check if there is any schedule que for this program
            // if exist dont alllow delete

            //1. delete related Testcases
            //2. delete related schedules
            //3. delete test program folder

            async.parallel({
              testcase: function(cb){
                //delete testcase
                Testcase.remove({"program":req.params.id}, cb);
                console.log('delete related testcase');
              },
              /*schedule: function(cb){
                //delete schedule
                Schedule.remove({"program":req.params.id}, cb);
                console.log('delete related schedule');
              },*/
              clean: function(cb){
                //clean test program folder
                fs.remove(__dirname+'/../../../test/'+req.params.id, cb);
              }
            }, function(err, results){
              //Returning success messages saying it was deleted
              message += '<li> Program deleted. </li>';
              if (results.testcase.result.ok == 1){
                message += '<li> Testcases deleted. </li>';
              }
              /*if (results.schedule.result.ok == 1){
                message += '<li> Schedules deleted. </li>';
              }*/
              if (results.clean == undefined){
                message += '<li> Program folder(testcases, screenshots, reports) deleted. </li>';
              }

              message = "<div class='callout callout-info'><ul>"+message+"</ul></div>";
              req.session.message = message;

              console.log('DELETE removing ID: ' + program._id);
              res.format({
                  //HTML returns us back to the main page, or you can create a success page
                  html: function(){
                        res.redirect("/management/programs");
                  },
                   //JSON returns the item with the message that is has been deleted
                  json: function(){
                        res.json({
                          message : 'deleted',
                          item : program
                        });
                  }
              });
            }); //end of async

          }
        });
      }
    });
  });

  // duplicate ///////////////////////////////////////////////////////////////////////
  app.get('/management/programs/:id/duplicate', app.auth, function (req, res, next) {
    //search for the program within Mongo
    var message ='';
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        // Pass error if no program found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //Return the program
        console.log('GET Retrieving ID for duplication: ' + program._id);

        var currentProgramId = program._id;

        //prepare the new copy of the program
        var name = program.name+" (copy) " + moment().format('DD/MM/YYYY HH:mm:ss');
        var version = program.version;
        var language = program.language;
        var baseurl = program.baseurl;

        //call the create function for our database
        Program.create({
          name : name,
          version : version,
          language : language,
          baseurl : baseurl
        }, function (err, program1) {
          if (err) {
            // res.send("There was a problem adding the information to the database.");
            console.log("There is a problem adding the new program");
          } else {
            //Blob has been created
            console.log('creating new program: ' + program1);
            var newProgramId = program1._id;

            message += "<li>Program successfully duplicated. </li>";

            Testcase.find({"program":program._id}, function (err, testcases) {
              if (err) {
                console.log('GET Error: There was a problem retrieving testcases: ' + err);
              } else {
                //loop in each testcase and make an insert
                for (var i = 0; i < testcases.length; i++) {

                  //call the create function for our database
                  Testcase.create({
                    name : testcases[i].name,
                    element : testcases[i].element,
                    button : testcases[i].button,
                    url : testcases[i].url,
                    category : testcases[i].category,
                    program : newProgramId
                  }, function (err, testcase1) {
                    if (err) {
                      console.log("There was a problem adding the information to the database.");
                    } else {
                      message += "<li>Tescase successfully duplicated. </li>";
                      console.log('POST creating new testcase: successful' + testcase1);
                    }
                  });
                } //end of for loop
              } //end of else
            }); //end of testcase.find by program

            //TODO
            // Add code to go in the folders and copy the files
            //1. copy baseline images
            var testPath = __dirname+"/../../../test/";
            var currentProgramScreenshotsPath = testPath+"/"+currentProgramId+"/screenshots";
            var newProgramScreenshotsPath = testPath+"/"+newProgramId+"/screenshots";

            //1.a check if folder exists
            //if yes, make a full copy recursively
            //else dont copy, append message; nothing to copy

            try {
              fs.copySync(currentProgramScreenshotsPath, newProgramScreenshotsPath);
              message += "<li>Screenshots successfully duplicated. </li>";
            } catch (err) {
              console.error('Oh no, there was an error in copying the baseline folder: ' + err.message);
              message += "<li>Screenshots was empty/not copied. </li>";
            }

            //2. copy testcases files
            var currentProgramTestcasePath = testPath+"/"+currentProgramId+"/tests";
            var newProgramTestcasePath = testPath+"/"+newProgramId+"/tests";

            //1.a check if folder exists
            //if yes, make a full copy recursively
            //else dont copy, append message; nothing to copy

            try {
              fs.copySync(currentProgramTestcasePath, newProgramTestcasePath);
              message += "<li>Testcases successfully duplicated. </li>";
            } catch (err) {
              console.error('Oh no, there was an error in copying the testcase folder: ' + err.message);
              message += "<li>Testcases was empty/not copied. </li>";
            }

            //3. return a concatenated sucess message with a redirect to new program id show page
            message = "<div class='callout callout-info'><ul>"+message+"</ul></div>";
            req.session.message = message;

            res.redirect("/management/programs/"+newProgramId);

          } //else part successfully creating a copy of the program
        }); //end of program create


      } //else part of find program by ID
    }); // find program by ID
  }); //closure for get route

}

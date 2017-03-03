module.exports = function (app) {

  var methodOverride = require('method-override'); //used to manipulate POST
  var async = require('async');

  var Testcase = require('../../models/testcase');
  var Program = require('../../models/program');
  var Category = require('../../models/category');

  // var requireUser = require('../../controllers/require-user');
  var writeTestcase = require('../../tasks/writeTestcase');

  app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

  // ALL ///////////////////////////////////////////////////////////////////////
  app.get('/management/testcases/', app.auth, function (req, res) {

    //delete programId session
    if(req.session.programId){
      console.log("remove previously stored programId in session")
      delete req.session.programId;
    }

    res.render('management/testcases/index', {
      title: 'Testcase Management'
    });

  });

  // NEW ///////////////////////////////////////////////////////////////////////
  app.get('/management/testcases/add', app.auth, function (req, res) {

    async.parallel({
      program: function(cb){
        //fetch programs
        Program.find({}, cb);
        console.log('Finding list of programs');
      },
      category: function(cb){
        //fetch categories
        Category.find({}, cb);
        console.log('Finding list of categories');
      }
    }, function(err, results){
      console.log(results);
      // results contains both users and articles
      res.render('management/testcases/add', { title: 'Add New Testcase' , result: results});
    });

  });

  // NEW  from param ////////////////////////////////////////////////////////////
  app.get('/management/testcases/add/:programId', app.auth, function (req, res) {
    async.parallel({
      program: function(cb){
        //fetch programs
        Program.find({}, cb);
        console.log('Finding list of programs');
      },
      category: function(cb){
        //fetch categories
        Category.find({}, cb);
        console.log('Finding list of categories');
      }
    }, function(err, results){
      console.log(results);
      // results contains both users and articles
      res.render('management/testcases/add', { title: 'Add New Testcase' , result: results, "programId": req.params.programId});
    });

  });


  // NEW - POST ////////////////////////////////////////////////////////////////
  app.post('/management/testcases/add', app.auth, function (req, res) {
    // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
    var name = req.body.testcase;
    var url = req.body.url;
    var button = req.body.button;
    var element = req.body.element;
    var category = req.body.category;
    var program = req.body.program;

    //call the create function for our database
    Testcase.create({
      name : name,
      element : element,
      button : button,
      url : url,
      category : category,
      program : program
    }, function (err, testcase) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        //Blob has been created
        console.log('POST creating new testcase: ' + testcase);
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function(){
              //if there is a program sesssion, redirect to program page
              //else redirect to testcases landing page
              if(req.session.programId){
                res.location("management/programs/"+req.session.programId);
                res.redirect("/management/programs/"+req.session.programId);
              } else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("management/testcases");
                // And forward to success page
                res.redirect("/management/testcases");
              }
          },
          //JSON response will show the newly created testcase
          json: function(){
              res.json(testcase);
          }
        });
      }
    })
  });


  // SHOW ///////////////////////////////////////////////////////////////////////
  app.get('/management/testcases/:id', app.auth, function (req, res, next) {
    console.log("request id : "+req.params.id);

    Testcase
    .findById(req.params.id)
    .populate('category program')
    .exec(function (err, testcase) {
      if (err) {
        // Pass error if no program found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        console.log(testcase);
        console.log('GET Retrieving ID: ' + testcase._id);
        res.format({
          html: function(){
              res.render('management/testcases/show', {
                "title" : 'Testcase details',
                "testcase" : testcase
              });
          },
          json: function(){
              res.json(testcase);
          }
        });
      }
    });

  });

  // EDIT ///////////////////////////////////////////////////////////////////////
  app.get('/management/testcases/:id/edit', app.auth, function (req, res, next) {

    Testcase
    .findById(req.params.id)
    .populate('category program')
    .exec(function (err, testcase) {
      if (err) {
        // Pass error if no program found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //Return the testcase
        console.log('GET Retrieving ID: ' + testcase._id);
        res.format({
            //HTML response will render the 'edit.jade' template
            html: function(){
              async.parallel({
                program: function(cb){
                  //fetch programs
                  Program.find({}, cb);
                  console.log('Finding list of programs');
                },
                category: function(cb){
                  //fetch categories
                  Category.find({}, cb);
                  console.log('Finding list of categories');
                }
              }, function(err, results){
                console.log(results);
                // results contains both users and articles
                res.render('management/testcases/edit', { title: 'Edit Testcase' , "testcase" : testcase, result: results});
              });
            },
             //JSON response will return the JSON output
            json: function(){
                  res.json(testcase);
            }
        });
      }
    });

  });

  app.put('/management/testcases/:id/edit', app.auth, function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.testcase;
    var element = req.body.element;
    var button = req.body.button;
    var url = req.body.url;
    var category = req.body.category;
    var program = req.body.program;

    //find the document by ID
    Testcase.findById(req.params.id, function (err, testcase) {
      //update it
      testcase.update({
        name : name,
        element : element,
        button : button,
        url : url,
        category: category,
        program: program
      }, function (err, testcaseID) {
        if (err) {
          res.send("There was a problem updating the information to the database: " + err);
        }
        else {
          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
          res.format({
            html: function(){
              //if there is a program sesssion, redirect to program page
              //else redirect to testcases edit page
              if(req.session.programId){
                res.redirect("/management/programs/"+req.session.programId);
              } else {
                res.redirect("/management/testcases/" + testcase._id);
              }
            },
             //JSON responds showing the updated values
            json: function(){
                  res.json(testcase);
            }
          });
         }
      })
    });
  });

  app.delete('/management/testcases/:id/edit', app.auth, function (req, res, next) {
    //find testcase by ID
    Testcase.findById(req.params.id, function (err, testcase) {
      if (err) {
        // Pass error if not found
        var myerr = new Error('Record not found!');
        return next(myerr);
      } else {
        //remove it from Mongo
        testcase.remove(function (err, testcase1) {
          if (err) {
            // Pass error
            var myerr = new Error('Unable to delete record!');
            return next(myerr);
          } else {
            //Returning success messages saying it was deleted
            console.log('DELETE removing ID: ' + testcase._id);
            res.format({
                //HTML returns us back to the main page, or you can create a success page
                html: function(){
                    //if there is a program sesssion, redirect to program page
                    //else redirect to testcases landing page
                    if(req.session.programId){
                      res.redirect("/management/programs/"+req.session.programId);
                    } else {
                      res.redirect("/management/testcases");
                    }
                },
                 //JSON returns the item with the message that is has been deleted
                json: function(){
                    res.json({message : 'deleted',
                         item : testcase1
                    });
                }
            });
          }
        });
      }
    });
  });


  // Write tescases to file ////////////////////////////////////////////////////////////////
  app.post('/management/testcases/write', app.auth, function (req, res) {
    // console.log("programId > "+programId);
    // console.log("type > "+type);

    Program.findById(req.body.programid, function (err, program) {
      if (err) {
        res.json({"status": false, "message": "No program found"});
      } else {

        var programId = program._id;
        var programBaseURL = program.baseurl;
        var type = req.body.type;

        if ((programId != undefined) || (type != undefined)){

          var rawName = program._id+"-"+program.name+"-"+program.version+"-"+program.language;
          var programName = rawName.replace(/[^\w-. ]/gi, '').replace(/ /g,"_").toLowerCase();

          async.series([
              function(cb){
                  writeTestcase(programId, programName, programBaseURL, app, type, cb);
              }
          ],
          function(err, results){
              res.json(results);
          });
        } else {
          //send error status
          res.json({"status": false, "message": "No program found"});
        }

      }
    });

  });

}

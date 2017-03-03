var fs = require('fs-extra');
var gulp = require('gulp');
var nightwatch = require('gulp-nightwatch');
var plumber = require('gulp-plumber');
var async = require('async');
var moment = require('moment');

module.exports = function (app) {

  var Program = require('../models/program');
  var Testcase = require('../models/testcase');
  var Statslog = require('../models/statslog');
  var Rawlog = require('../models/rawlog');
  var Socket = require('./socket');
  Socket.init();

  var deleteTestlogs = function(programId) {
    Rawlog.remove({ program: programId }, function (err) {
      if (err) return handleError(err);
      console.log('Rawlog cleared!');// removed!
    });
  }

  var deleteOneTestlog = function(testcaseId) {
    Rawlog.find({ testcase: testcaseId }).remove().exec(function(err, data){ console.log(data.result); });
  }

  var testLogEntry = function(param) {
    var passedCount = 0;
    var failedCount = 0;
    if(param.testcases == 1) {
      // only one test case, make the calulation per testcase
      //loop in record
      Rawlog.find({testcase: param.testcaseId}, function (err, logs) {
        logs.forEach(function(log, index) {
          passedCount += log.passed;
          failedCount += (log.failed + log.error);
        });
        // add record
        Statslog.create({
          date: param.date,
          program: param.programId,
          testcases: param.testcases,
          success: passedCount,
          fail: failedCount
        }, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully add testlog for 1 testcase!');
          }
        });
      });
    } else {
      // make the calculation as per programs
      //loop in record
      Rawlog.find({program: param.programId}, function (err, logs) {
        logs.forEach(function(log, index) {
          passedCount += log.passed;
          failedCount += (log.failed + log.error);
        });
        // add record
        Statslog.create({
          date: param.date,
          program: param.programId,
          testcases: param.testcases,
          success: passedCount,
          fail: failedCount
        }, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully add testlog for entire program!');
          }
        });
      });
    }
  }

  app.get('/program', app.auth, function (req, res) {
    res.render('program', {
          title: 'Program'
      });
  });

  app.get('/program/:id', app.auth, function (req, res, next) {
    async.parallel({
      program: function(cb) {
        Program.findById(req.params.id, cb);
      },
      testcase: function(cb) {
        Testcase.find({"program":req.params.id}, cb);
      }
    }, function(err, results) {
      if(results.program === null || results.program === undefined) {
        req.flash('error', 'Record not found!');
        return res.redirect('/program');
      }
      var output = {};
      if (req.session.message){
        output = {
                  "title" : 'Report details',
                  "program" : results.program,
                  "testcases" : results.testcase,
                  "message" : req.session.message,
                  "messageType" : req.session.messageType
                }
        req.session.message = null;
        req.session.messageType = null;
      } else {
        output = {
                  "title" : 'Report details',
                  "program" : results.program,
                  "testcases" : results.testcase
                }
      }
      res.render('report', output);
    });
  });


  app.post('/program/:id/test', app.auth, function (req, res, next) {
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        req.flash('error', 'Record not found!');
        return res.redirect('/program/'+req.params.id);
      }
      //Clear previous reports if any
      var targetReportPath = __dirname+'/../../test/'+program._id+'/'+'reports';
      fs.removeSync(targetReportPath);
      fs.ensureDirSync(targetReportPath);
      var targetJson = __dirname+'/../../test/'+program._id+'/'+'nightwatch.json';
      var testcases = req.body.testcase_count;
      deleteTestlogs(program._id);
      //initiate the task
      gulp.src('')
      .on('end', function() { console.log('source ended'); })
      .pipe(plumber())
      .pipe(nightwatch({
        configFile: targetJson,
        // cliArgs: { reporter: reporterURL }
      }))
      .on('error', function() {
        testLogEntry({
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          programId: program._id,
          testcases: testcases
        });
        Socket.send({'status': 'success', 'message': 'Testing completed with some errors!', 'user': req.user.email, 'program': program._id});
      })
      .on('end', function() {
        testLogEntry({
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          programId: program._id,
          testcases: testcases
        });
        Socket.send({'status': 'success', 'message': 'Testing completed!', 'user': req.user.email, 'program': program._id});
      });
      res.format({
        html: function(){
            res.render('test-progress', {
              "title" : 'Test',
              "program" : program
            });
        },
        json: function(){
            res.json(program);
        }
      });
    });
  });

  //retest module
  app.post('/program/:id/retest', app.auth, function (req, res, next) {
    var rawTestcase = req.body.testcase_module;
    var testcaseModule = rawTestcase.replace(/[^\w]/gi, '').replace(/ /g,"_").toLowerCase();
    var testcaseId = req.body.testcase_id;
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        req.flash('error', 'Record not found!');
        return res.redirect('/program/'+req.params.id);
      }
      //Clear previous reports if any
      var targetReportPath = __dirname+'/../../test/'+program._id+'/'+'reports/'+testcaseModule;
      fs.removeSync(targetReportPath);
      fs.ensureDirSync(targetReportPath);
      var targetJson = __dirname+'/../../test/'+program._id+'/'+'nightwatch.json';
      deleteOneTestlog(testcaseId);
      //initiate the task
      gulp.src('')
      .on('end', function() { console.log('source ended'); })
      .pipe(plumber())
      .pipe(nightwatch({
        configFile: targetJson,
        // cliArgs: { group: testcase, reporter: reporterURL }
        cliArgs: { group: testcaseModule }
        }))
      .on('error', function() {
        // console.log('pipe ended');
        testLogEntry({
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          programId: program._id,
          testcases: '1',
          testcaseId: testcaseId
        });
        Socket.send({
          'status': 'success',
          'message': 'Testing completed with some errors!',
          'user': req.user.email,
          'program': program._id
        });
      })
      .on('end', function() {
        testLogEntry({
          date: moment().format('DD/MM/YYYY HH:mm:ss'),
          programId: program._id,
          testcases: '1',
          testcaseId: testcaseId
        });
        Socket.send({
          'status': 'success',
          'message': 'Testing completed!',
          'user': req.user.email,
          'program': program._id
        });
      });
      res.format({
        html: function(){
            res.render('test-progress', {
              "title" : 'Test',
              "program" : program
            });
        },
        json: function(){
            res.json(program);
        }
      });
    });
  });


  // TODO convert this to post
  app.get('/program/:id/clear/:type', app.auth, function (req, res, next) {
    Program.findById(req.params.id, function (err, program) {
      if (err) {
        req.flash('error', 'Record not found!');
        return res.redirect('/program/'+req.params.id);
      }
      //wipe the folder
      var targetDir;
      if(req.params.type == 'image'){
        targetDir = __dirname+'/../../test/'+program.id+'/screenshots/';
      } else {
        targetDir = __dirname+'/../../test/'+program.id+'/reports/';
      }
      deleteTestlogs(program._id);
      fs.emptyDir(targetDir, function (err) {
        if (err){
          res.format({
              //HTML returns us back to the main page, or you can create a success page
              html: function(){
                req.session.message = 'Error in cleaning directory: '+targetDir;
                req.session.messageType ='error';
                res.redirect('/program/'+program._id);
              },
              //JSON returns the item with the message that is has been deleted
              json: function(){
                  res.json({message : 'Files not deleted',
                    item : program
                  });
              }
            });
        } else {
            res.format({
              //HTML returns us back to the main page, or you can create a success page
              html: function(){
                req.session.message = 'Successfully clean current directory';
                req.session.messageType ='success';
                res.redirect('/program/'+program._id);
              },
              //JSON returns the item with the message that is has been deleted
              json: function(){
                  res.json({message : 'Files deleted',
                    item : program
                  });
              }
            });
        }
      });
    });
  });
}

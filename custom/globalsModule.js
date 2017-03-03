var mongoose = require('mongoose');
var Rawlog = require('../app/models/rawlog');
// var Socket = require('../app/routes/socket');
// Socket.init();

module.exports = {
  // this controls whether to abort the test execution when an assertion failed and skip the rest
  // it's being used in waitFor commands and expect assertions
  abortOnAssertionFailure : true,

  // this will overwrite the default polling interval (currently 500ms) for waitFor commands
  // and expect assertions that use retry
  waitForConditionPollInterval : 300,

  // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
  // expect assertions
  waitForConditionTimeout : 5000,

  // this will cause waitFor commands on elements to throw an error if multiple
  // elements are found using the given locate strategy and selector
  throwOnMultipleElementsReturned : true,

  // controls the timeout time for async hooks. Expects the done() callback to be invoked within this time
  // or an error is thrown
  asyncHookTimeout : 10000,

  'default' : {
    myGlobal : function() {
      return 'I\'m a method';
    }
  },

  'test_env' : {
    myGlobal: 'test_global',
    beforeEach : function() {

    }
  },

  before : function(cb) {
    cb();
  },

  beforeEach : function(browser, cb) {
    cb();
  },

  after : function(cb) {
    cb();
  },

  afterEach : function(browser, cb) {
    cb();
  },

  reporter : function(results, cb) {
    //retrieve the program ID
    // var programStr = this.process.argv[2];
    // var reg = /test\\\\([^*]+)\\\\/;
    // var programId = programStr.match(reg)[1];

    // console.log("programId: "+programId);
    // console.log(process.env.DB_HOST+'/'+process.env.DB_NAME);
    //merege the Array
    // Object.assign(results, { program: programId });

    // console.log("---------------------this---------------------------------------")
    // console.log(this);
    // console.log("---------------------this.config--------------------------------")
    // console.log(this.process.mainModule);
    // console.log("---------------------this.mainModule.children----------------------------")
    // console.log(this.process.mainModule.children[0]);

    // console.log(results);

    // var testName = Object.keys(results.modules)[0];
    var testGroup = results.modules[Object.keys(results.modules)[0]].group;
    var completedResult = results.modules[Object.keys(results.modules)[0]].completed;
    var timestamp =  results.modules[Object.keys(results.modules)[0]].timestamp;
    var mixedIds = Object.keys(completedResult)[0].split("||");
    var programId = mixedIds[0];
    var testcaseId =  mixedIds[1];
    var testName =  mixedIds[2];
    var category =  mixedIds[3];

    // programID, testcaseID, testcaseName, testcaseCategory

console.log("--------------------------------------------");
console.log(Object.keys(completedResult));
console.log("--------------------------------------------");

    // Socket.send({'status': 'success', 'message': 'Testing completed!', 'user': 'anon', 'program': programId});

    mongoose.connect('mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME, function (err, db) {
        if (err) {
            throw err;
        }
        console.log("connected");

        Rawlog.create({
          testname: testName,
          testgroup: testGroup,
          timestamp: timestamp,
          category: category,
          program: programId,
          testcase: testcaseId,
          passed: results.passed,
          failed: results.failed,
          error: results.errors,
          skipped: results.skipped,
          tests: results.tests,
          errmessages: results.errmessages,
          assertions: results.assertions
        }, function (err, result) {
          if (err) {
            cb();
            console.log(err);
          } else {
            console.log('Successfully add rawlog!');
            // Socket.send({'status': 'info', 'message': 'Successfully add rawlog!', 'user': 'anonymous'});
            // Socket.send({'status': 'success', 'message': 'Testing completed with some errors!', 'user': req.session.username, 'program': program._id});
            // Socket.send({'status': 'success', 'message': 'Testing completed!', 'user': req.session.username, 'program': program._id});
            cb();
          }
        });

    });
    // cb();
  }
};

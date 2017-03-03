Current Roadmap
################################################################################

Cron job
  - read schedule table on a 5 mins basis
Websocket to send mail for scheduling

Implement ACL
  - add user rights (administrator/manager/user)
  - user can only access non-management section
  - manager can view management section except user
  - promotion of user can be done by administrator
  - Resource: https://www.npmjs.com/package/acl

Implementation of Management of Users
  - Edit of user by an administrator

Implement login auth for testcases
  - Testcase form
    - add user, pass and url
    - add username field class, password field class and login/submit button class
    - add option require auth
  - WriteTestcase
    - pass the new parameters
    - add auth block

Implement setup script

Implement react.js

Management
1. Implement export test case as JSON
2. Implement case archiving

################################################################################
In progress
################################################################################

* clean up gulpfile
* implement fusebox

Add clear log in program Management section(delete physical file & entry from db)

* Add preTest field to testcases to contain auth code (RAW)

Create API section

implementation of user agents:
http://stackoverflow.com/questions/29522757/custom-useragent-in-nightwatch
"desiredCapabilities": {
    "browserName": "chrome",
    "chromeOptions": {
      "args": [
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
        "--window-size=320,640"
      ]
    },
    "javascriptEnabled": true,
    "acceptSslCerts": true
  }

Mallegan Project
https://www.tildedave.com/2015/11/11/scaling-out-tilts-nightwatch-tests-with-magellan.html
https://github.com/TestArmada/magellan
https://github.com/TestArmada/boilerplate-nightwatch

################################################################################
Completed
################################################################################

* clean up on auth file

* Exernalize mailgun credentials

Implement local passport?
 - confirm password
 - update profile

Implement reset password
http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
https://www.npmjs.com/package/password-reset

* Rework the results tabs using mongo instead of crawling the filename *
* remove clear report from deleting files to mongo*

Homepage
1. list all recent activities run by anyone
2. display stats
  - number of programs
  - number of testcases

Add test logs to dashboard

Populate category and program from testcases section

All program page
1. implement data table/ sortering/search with react (done without react)

Program page
1. Remove schedule
2. Display failed and pass status

Clean up nightwatch.json file

enable websockets on all pages

Add safe wrappers to all errors

Implement dynamic tables

Add last run date in report page

Add test case tabs, to select and run test
Enable to run only one specific testcase

Implement add base url

Implement livereload

Schedule a test
  - add option in dropdown
  - schedule page
  - model schedule
    - program
    - date
    - time
    - status
    - user
    - created_date
    - description

Schedule a test
    - management(add/edit/delete)

Queue list
  - all by descending order
  - UI tasks
  - implement force Run (update entry to date now with comment Run now by user @)
  - implement cancel (update entry; set status cancelled with comment cancelled by user @)

Refactor all views to management folder

Websocket to send message to specific username
  - in WriteTestcase
  - upon completion

Write test case - full wipe / report wipe
  - additional param?? Soft write/ hard write - in management preogram>testcases

Provide number of testcases for each program in grid box

Encrypt user password

db.schedules.update( {"user":"569f69509c5963e49c133c97"}, { $set: { "user":"56b8be43a0482c4813cea3ec"}}, false, true);

remove all IDS in views

Implement button click for Testcase
  - add new field button
  - if button is present add in writetest case

Duplicate program
  - on click on duplicate,
    - create a new program
    - save it, add in name - (copy)(date and time)
    - copy all contents of folder to another PID folder
    - open new PID in edit mode

When deleting a program, it should delete all associated testcases

Mongodb
  - Add type and constraint to collection fields (note: contraint not applicable)
https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications

Implement parsley validation on forms

Implement MomentJS : http://momentjs.com/

Add lazyload to image in report page

Direct copy of image from test to baseline

Fix testcase element pattern (partial)..

Implement view report file

Add testcase name in report view

Seperate testcase by testcase instead by category

Add signifiant name to testcases images

Add regex to testcase name to take only a-z0-9 including space only

Enable single run of a testcase

change reporter (ie remove stack trace)

fix security issue on writetestcase method

Add symlink in test folder - to be created each time when writing testcases

Create testcase tasks

Configure testcase with Jenkins
cd C:\inetpub\wwwroot\ProcterGamble\Multibrand\www\nightvision
node node_modules\gulp\bin\gulp.js test -t 56e13eebd6c9c0dc52fc4c0b

Jenkins
https://wiki.jenkins-ci.org/display/JENKINS/Use+Jenkins

Nightwatch + CI
http://juristr.com/blog/2014/02/nightwatch-test-automation/

add tag support to testcases:
module.exports = {
  '@tags': ['login', 'sanity'],
  'demo login test': function (client) {
     // test code
  }
};
To select which tags to run, use the --tag command line flag:
$ nightwatch --tag login
Specify multiple tags as:
$ nightwatch --tag login --tag something_else

backup example of query
Program.find({}, function (err, programs) {
      if (err) {
          return console.error(err);
      } else {
          //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
          res.format({
              //HTML response will render the index.jade file in the views/programs folder. We are also setting "programs" to be an accessible variable in our jade view
            html: function(){
                res.render('program', {
                      title: 'Program',
                      programs: programs
                  });
            },
            //JSON response will show all programs in JSON format
            json: function(){
                res.json(programs);
            }
        });
      }
});

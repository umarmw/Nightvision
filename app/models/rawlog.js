var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var Schema = mongoose.Schema;

var rawlogSchema = new Schema({
  testname: String,
  testgroup: String,
  timestamp: String,
  category: String,
  program: String,
  testcase: String,
  passed: Number,
  failed: Number,
  error: Number,
  skipped: Number,
  tests: Number,
  errmessages: Array,
  assertions: Number
});

/*
passed: 4,
failed: 1,
errors: 0,
skipped: 0,
tests: 5,
errmessages: [],
modules:
 { 'regex\regex':
    { completed: [Object],
      skipped: [],
      time: '13.73',
      timestamp: 'Mon, 30 Jan 2017 12:16:38 GMT',
      group: 'regex',
      tests: 4,
      failures: 1,
      errors: 0,
      errmessages: [] } },
assertions: 5,
program: '588f0d63cdeb3347f8d4635a' }

  */
rawlogSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

var Rawlog = mongoose.model('rawlog', rawlogSchema);

module.exports = Rawlog;

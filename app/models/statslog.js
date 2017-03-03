var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var Schema = mongoose.Schema;

var statslogSchema = new Schema({
  date: { type: String, required: true },
  program: { type: Schema.Types.ObjectId, ref: 'program', required: true },
  testcases: String,
  success: String,
  fail: String
});

statslogSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

var Statslog = mongoose.model('statslog', statslogSchema);

module.exports = Statslog;

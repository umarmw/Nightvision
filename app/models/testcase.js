var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var Schema = mongoose.Schema;

var testcaseSchema = new Schema({
  name: String,
  element: { type: String, required: true },
  url: { type: String, required: true },
  button: String,
  category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  program: { type: Schema.Types.ObjectId, ref: 'program', required: true },
  preTest: String,
  ref: String
});

testcaseSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

var Testcase = mongoose.model('testcase', testcaseSchema);

module.exports = Testcase;

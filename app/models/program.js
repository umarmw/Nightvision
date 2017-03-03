var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var Schema = mongoose.Schema;

var programSchema = new Schema({
  name: { type: String, required: true },
  version: String,
  language: String,
  baseurl: String
});

programSchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

var Program = mongoose.model('program', programSchema);

module.exports = Program;

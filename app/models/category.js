var mongoose = require('mongoose');
var dataTables = require('mongoose-datatables');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String, required: true }
});

categorySchema.plugin(dataTables, {
  totalKey: 'recordsTotal',
  dataKey: 'data'
});

var Category = mongoose.model('category', categorySchema);

module.exports = Category;

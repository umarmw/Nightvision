module.exports = function (app) {

  var Testcase = require('../models/testcase');
  var Program = require('../models/program');
  var Category = require('../models/category');
  var Statslog = require('../models/statslog');
  var Rawlog = require('../models/rawlog');

  app.post('/api/testcases', app.auth, function(req, res) {
    // enable for debug

    // console.log("-------------------------------->")
    // console.log(req.body);
    // console.log("-------------------------------->")

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Testcase.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['name']
      },
      select: {
        _id: 1,
        name: 1,
        element: 1,
        url: 1,
        category: 1
      },
      sort : sortArgs,
      populate: { path: 'category', select: 'name -_id' }
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

  app.post('/api/testcases/:programId', app.auth, function(req, res) {
    // var programId = req.params.programId;

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Testcase.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['name']
      },
      find: {
        program: req.params.programId
      },
      select: {
        _id: 1,
        name: 1,
        element: 1,
        url: 1,
        category: 1
      },
      sort : sortArgs,
      populate: { path: 'category', select: 'name -_id' }
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

  app.post('/api/programs', app.auth, function(req, res) {
    // enable for debug

    // console.log("-------------------------------->")
    // console.log(req.body);
    // console.log("-------------------------------->")

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Program.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['name']
      },
      select: {
        _id: 1,
        name: 1,
        version: 1,
        language: 1
      },
      sort : sortArgs
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

  app.post('/api/categories', app.auth, function(req, res) {
    // enable for debug

    // console.log("-------------------------------->")
    // console.log(req.body);
    // console.log("-------------------------------->")

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Category.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['name']
      },
      select: {
        _id: 1,
        name: 1
      },
      sort : sortArgs
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

  app.post('/api/statslogs', app.auth, function(req, res) {
    // enable for debug

    // console.log("-------------------------------->")
    // console.log(req.body);
    // console.log("-------------------------------->")

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Statslog.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['program']
      },
      select: {
        _id: 1,
        date: 1,
        program: 1,
        testcases: 1,
        success: 1,
        fail: 1
      },
      populate: { path: 'program', select: '_id name version language' },
      sort : sortArgs
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

  app.post('/api/rawlogs', app.auth, function(req, res) {
    // enable for debug

    // console.log("-------------------------------->")
    // console.log(req.body);
    // console.log("-------------------------------->")

    //construct sort object
    var orderByType = (req.body.order[0]['dir'] == "asc") ? 1 : -1;
    var orderByColumn = req.body.columns[req.body.order[0]['column']].data;
    // create the object literal
    var sortArgs = {};
    // Assign the variable property name with a value of 10
    sortArgs[orderByColumn] = orderByType;

    Rawlog.dataTables({
      limit: req.body.length,
      skip: req.body.start,
      search: {
        value: req.body.search.value,
        fields: ['testname']
      },
      select: {
        _id: 1,
        testname: 1,
        program: 1,
        testcase: 1,
        category: 1,
        timestamp: 1,
        passed: 1,
        failed: 1
      },
      sort : sortArgs
      // sort: {
      //   name: 1
      // }
    }, function (err, table) {
      // res.json(table); // table.total, table.data
      res.json({
        data: table.data,
        recordsFiltered: table.recordsTotal,
        recordsTotal: table.recordsTotal
      });
    });
  });

}

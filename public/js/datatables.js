$(document).ready(function(){
  /** EXAMPLE*/
  /*
  $('#example2').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false
  });
  */

    if ($('.js-testcases-management').length) {
      /***
      * Description: Datatable for testcases management
      * ID: #testcases-management
      * Class: .js-testcases-management
      **/

      $('#testcases-management').dataTable({
        "searching": true,
        ajax: {
          url: '/api/testcases',
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'name'},
          {'data': 'category.name'},
          {'data': 'element'},
          {'data': 'url'},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "createdRow": function (row, data, index) {
          $('td', row).eq(4).html('<div class="btn-group"><a class="btn btn-default btn-sm" href="/management/testcases/'+data['_id']+'">View</a><a class="btn btn-default btn-sm" href="/management/testcases/'+data['_id']+'/edit">Edit</a></div>');
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
      });

      $(".js-testcases-management .datatable-header").append('<div class="pull-right btn-group"><button class="btn btn-success btn-sm" type="button">Action</button><button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" role="menu"><li><a href="/management/testcases/add">Create Testcase</a></li></ul></div>');
    }


    if ($('.js-programs-management').length) {
      /***
      * Description: Datatable for programs management
      * ID: #programs-management
      * Class: .js-programs-management
      **/

      $('#programs-management').dataTable({
        "searching": true,
        ajax: {
          url: '/api/programs',
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'name'},
          {'data': 'version'},
          {'data': 'language'},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "createdRow": function (row, data, index) {
          if($(".js-programs-management").attr("data-management") == "true") {
            $('td', row).eq(3).html('<div class="btn-group"><a class="btn btn-default btn-sm" href="/management/programs/'+data['_id']+'">View</a><a class="btn btn-default btn-sm" href="/management/programs/'+data['_id']+'/edit">Edit</a></div>');
          } else {
            $('td', row).eq(3).html('<div class="btn-group"><a class="btn btn-default btn-sm" href="/program/'+data['_id']+'">Launch</a></div>');
          }
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
      });

      if($(".js-programs-management").attr("data-management") == "true") {
        $(".js-programs-management .datatable-header").append('<div class="pull-right btn-group"><button class="btn btn-success btn-sm" type="button">Action</button><button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" role="menu"><li><a href="/management/programs/add">Create Program</a></li></ul></div>');
      }
    }

    if ($('.js-statslog').length) {
      /***
      * Description: Datatable for statslog index
      * ID: #statslog
      * Class: .js-statslog
      **/

      $('#statslog').dataTable({
        "searching": false,
        ajax: {
          url: '/api/statslogs',
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'date'},
          {'data': 'program.name'},
          {'data': 'program.version'},
          {'data': 'program.language'},
          {'data': 'testcases'},
          {'data': 'success'},
          {'data': 'fail'},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "order": [[ 1, "desc" ]],
        "createdRow": function (row, data, index) {
          $('td', row).eq(7).html('<div class="btn-group"><a class="btn btn-info btn-sm" href="/program/'+data['program']['_id']+'">View</a></div>');
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
      });

    }


    if ($('.js-categories-management').length) {
      /***
      * Description: Datatable for categories management
      * ID: #categories-management
      * Class: .js-categories-management
      **/

      $('#categories-management').dataTable({
        "searching": true,
        ajax: {
          url: '/api/categories',
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'name'},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "createdRow": function (row, data, index) {
          $('td', row).eq(1).html('<div class="btn-group"><a class="btn btn-default btn-sm" href="/management/categories/'+data['_id']+'">View</a><a class="btn btn-default btn-sm" href="/management/categories/'+data['_id']+'/edit">Edit</a></div>');
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
      });

      $(".js-categories-management .datatable-header").append('<div class="pull-right btn-group"><button class="btn btn-success btn-sm" type="button">Action</button><button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" role="menu"><li><a href="/management/categories/add">Create Program</a></li></ul></div>');
    }


    if ($('.js-testcases-by-program').length) {
      /***
      * Description: Datatable for testcases management
      * ID: #testcases-management
      * Class: .js-testcases-management
      **/

      var programId = $('.js-testcases-by-program').attr('data-program-id');

      $('#testcases-by-program').dataTable({
        "searching": true,
        ajax: {
          url: '/api/testcases/'+programId,
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'name'},
          {'data': 'category.name'},
          {'data': 'element'},
          {'data': 'url'},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "createdRow": function (row, data, index) {
          if($(".js-testcases-by-program").attr("data-management") == "true") {
            $('td', row).eq(4).html('<div class="btn-group"><a class="btn btn-default btn-sm" href="/management/testcases/'+data['_id']+'">View</a><a class="btn btn-default btn-sm" href="/management/testcases/'+data['_id']+'/edit">Edit</a></div>');
          } else {
            $('td', row).eq(4).html('<div class="btn-group"><a class="btn btn-info btn-sm js-re-run-test" href="#" data-module="'+data['name']+'" data-program="'+data['_id']+'">Run Test</a></div>');
          }
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
        "initComplete": function( settings, json ) {
          $("#testcases-by-program").css("width", "100%");
        }
      });

      if($(".js-testcases-by-program").attr("data-management") == "true") {
        $(".js-testcases-by-program .datatable-header").append('<div class="pull-right btn-group"><button class="btn btn-success btn-sm" type="button">Action</button><button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" role="menu"><li><a href="/management/testcases/add/'+programId+'">Create Testcase</a></li><li class="divider"></li><li><a class="js-write-testcase" href="#" data-program-id="'+programId+'" data-type="soft">Write Testcase Only</a></li><li class="divider"></li><li><a class="js-write-testcase" href="#" data-program-id="'+programId+'" data-type="hard">Delete project &amp; Write Testcase</a></li></ul></div>');
      } else {
        //
      }

    }

    if ($('.js-rawlogs').length) {
      /***
      * Description: Datatable for rawlogs index
      * ID: #rawlogs
      * Class: .js-rawlogs
      **/

      $('#rawlogs').dataTable({
        "searching": true,
        ajax: {
          url: '/api/rawlogs',
          type: 'POST'
        },
        serverSide: true,
        columns: [
          {'data': '_id'},
          {'data': 'testname'},
          {'data': 'category'},
          {'data': 'timestamp'},
          {'data': 'passed'},
          {'data': 'failed'},
          {'data': 'program'},
          {'data': 'testcase'},
          {'data': null},
          {'data': null}
        ],
        "columnDefs": [
          {
            "targets": [ 0, 4, 5, 6, 7 ],
            "visible": false
          },
          {
            //disable ordering on action column
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent":''
          }
        ],
        "order": [[ 1, "asc" ]],
        "createdRow": function (row, data, index) {
          var statusResult = "";
          var statusAction = "";

          var module = data['testname'].replace(/[^\w]/gi, '').replace(/ /g,"_").toLowerCase();

          if(data['failed'] == 0){
            statusResult = '<label class="btn btn-success btn-xs"><i class="fa fa-fw fa-check"></i></label>';
            statusAction = '<button class="btn btn-success btn-sm js-view-report" data-base-module-path=  "./test/'+data['program']+'/screenshots/'+module+'/">View</button>';
          } else {
            statusResult = '<label class="btn btn-danger btn-xs"><i class="fa fa-fw fa-close"></i></label>';
            statusAction = '<div class="btn-group"><button type="button" class="btn btn-info btn-sm">Action</button><button type= "button" data-toggle="dropdown" class="btn btn-info btn-sm dropdown-toggle" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul role="menu" class="dropdown-menu"><li><a href="#" class="js-view-report" data-base-module-path=  "./test/'+data['program']+'/screenshots/'+module+'/">View</a></li><li><a href="#" class="js-update-baseline" data-base-module-path= "./test/'+data['program']+'/screenshots/'+module+'/">Update Baseline</a></li><li><a href="#" class="js-re-run-test" data-module="'+module+'" data-testcase="'+data['testcase']+'" data-program= "'+data['program']+'">Re-run Test</a></li></ul></div>';
          }
          $('td', row).eq(3).html(statusResult);
          $('td', row).eq(4).html(statusAction);
        },
        "language": {
          "oPaginate": { "sFirst": "First", "sLast": "Last", "sNext": ">", "sPrevious": "<" }
        },
        "dom": '<"datatable-header"f><"datatable-scroll"t><"datatable-footer"lip>',
        "pagingType": "full_numbers",
      });

    }


});

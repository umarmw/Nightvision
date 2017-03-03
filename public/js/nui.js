$(document).ready(function(){

  if($('.js-report-table').length >0 ){
  //   //activate lazyload
  //
  //
  //   $('.js-report-table').parent().append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
  //
  //   //do some post
  //   // $.post( '/report/list', $( '.js-get-xml-report' ).serialize() )
  //   // .done(function( data ) {
  //   //
  //   //   //console.log(data);
  //   //
  //   //   var count = data.length;
  //   //   //console.log(count);
  //   //
  //   //   var pass = '<button class="btn btn-success btn-xs" data><i class="fa fa-fw fa-check"></i></button>';
  //   //   var fail = '<button class="btn btn-danger btn-xs"><i class="fa fa-fw fa-close"></i></button>';
  //   //
  //   //   $.each(data, function(i, val){
  //   //     //console.log( i );
  //   //     //console.log( val );
  //   //     var testPath = val['file'].split("/");
  //   //
  //   //     var moduleName = testPath[4];
  //   //     var basePath = './'+testPath[1]+'/'+testPath[2]+'/';
  //   //     var baseModulePath = basePath+'screenshots/'+moduleName+'/';
  //   //
  //   //     var resultIcon = '';
  //   //     var resultBtn = '';
  //   //
  //   //     // if pass
  //   //     if(val['testresult'][3] == 0){
  //   //       resultIcon = pass;
  //   //       resultBtn = '<button data-report='+val['file']+' data-base-module-path='+baseModulePath+' class="js-view-report btn btn-success btn-sm">View</button>';
  //   //     } else {
  //   //       //if fail
  //   //       resultIcon = fail;
  //   //
  //   //       resultBtn = '<div class="btn-group">'+
  //   //                     '<button type="button" class="btn btn-info btn-sm">Action</button><button type="button" data-toggle="dropdown" class="btn btn-info btn-sm dropdown-toggle"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>'+
  //   //                       '<ul role="menu" class="dropdown-menu">'+
  //   //                         '<li><a href="#" class="js-view-report" data-report="'+val['file']+'" data-base-module-path="'+baseModulePath+'"> <span class="glyphicon glyphicon-eye-open"></span>View</a></li>'+
  //   //                         '<li class="divider"></li>'+
  //   //                         '<li><a href="#" class="js-update-baseline" data-base-module-path="'+baseModulePath+'"> <span class="glyphicon glyphicon-transfer"></span>Update Baseline</a></li>'+
  //   //                         '<li class="divider"></li>'+
  //   //                         '<li><a href="#" class="js-re-run-test" data-module="'+moduleName+'" data-program="'+testPath[2]+'"> <span class="fa fa-fw fa-repeat"></span>Re-run Test</a></li>'+
  //   //                        '</ul>'+
  //   //                     '</div>';
  //   //     }
  //   //
  //   //     $('.js-report-table tbody').append('<tr class="js-detail-row"><td>'+i+'</td><td>'+val['testresult'][0]+'</td><td>'+val['testresult'][1]+'</td><td><span class="js-result-val">Errors: '+val['testresult'][2]+' Failures: '+val['testresult'][3]+' Tests: '+val['testresult'][4]+'</span></td><td>'+val['date']+'</td><td><span class="js-view-xml-report" data-report="'+val['file']+'" >'+resultIcon+'</span></td><td>'+resultBtn+'</td></tr>');
  //   //
  //   //     //remove spinner
  //   //     $('.overlay').remove();
  //   //
  //   //   });
  //
  //     // if(data.length == 0){
  //     //   $('.js-report-table tbody').append('<tr class="alert-danger js-detail-row"><td colspan=7> No test file found! Please run the test first!</td></tr>');
  //     //   $('.overlay').remove();
  //     // }
  //
  //
  //   });


    $(document).on('click', '.js-view-report', function (e) {
      e.preventDefault();

      var elem = $(this);
      var levelDeep = '../../'; //$('.js-level-deep').val();

      var data = {
        report : $(this).data('report'),
        basepath : $(this).data('base-module-path'),
      };

      $.post( '/report/detail', data )
      .done(function( response ) {
        var row ='';
        //for each
        $.each(response, function(i, val){
          row +='<tr><td class="col-md-4"><img src="/img/loader.gif" data-original="'+levelDeep+val['baseline']+'" class="img-responsive lazy" /></td><td class="col-md-4"><img src="/img/loader.gif" data-original="'+levelDeep+val['results']+'" class="img-responsive lazy" /></td><td class="col-md-4"><img src="/img/loader.gif" data-original="'+levelDeep+val['diffs']+'" class="img-responsive lazy" /></td></tr>';
        });

        var innerTable = '<table class="table table-hover"><tbody><tr><th class="col-md-4">Baseline</th><th class="col-md-4">Result</th><th class="col-md-4">Diff</th></tr>'+row+'</tbody></table>';
        // var rowElem = '<tr class="js-report-pane"><td colspan="6">'+innerTable+'</td></tr>';
        // $( rowElem ).insertAfter( elem.closest('.js-detail-row') );
        //console.log(response)


        $('#compare-modal .modal-dialog').css({"width":"90%"});
        $('#compare-modal .modal-body').empty().append(innerTable);
        $('#compare-modal').modal('show');
        $("img.lazy").lazyload({threshold : 200});
        //$(window).resize();//force trigger the lazyload


      });

      //elem.removeClass('js-view-report').addClass('js-collapse-report');
    });

    $(document).on('click', '.js-update-baseline', function (e) {
      e.preventDefault();
      var elem = $(this);

      var data = {
        basepath : $(this).data('base-module-path')
      }

      $.post( '/report/updatebaseline', data )
      .done(function( response ) {
        console.log(response);
        var message = '';
        if (response == "success") {
          message = '<div class="alert alert-success alert-dismissible">'+
                      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
                      '<h4>Success!</h4>'+
                      'Baseline Updated!'+
                      '</div>'
        } else {
          message = '<div class="alert alert-danger alert-dismissible">'+
                      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
                      '<h4>Alert!</h4>'+
                      'Error in updating baseline'+ response +
                      '</div>'
        }
        //add message to Page
        $('.js-message-pane').empty().html(message);

        //whatever happens
        //code to collapse the report pane
        // if(elem.closest('.js-detail-row').next().hasClass('js-report-pane')){
        //   elem.prev().removeClass('js-collapse-report').addClass('js-view-report');
        //   elem.closest('.js-detail-row').next().remove();
        // }

      });
    });


    // $(document).on('click', '.js-view-xml-report', function (e) {
    //   e.preventDefault();
    //   console.log($(this).data('report'));
    //   var data = {
    //     report : $(this).data('report')
    //   }
    //   $.post( '/report/viewreport', data )
    //   .done(function( response ) {
    //     var xml = String(response).replace(/&/g, '&amp;').replace(/</g,     '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    //     var message = "<div>"+xml+"</div>";
    //     $('#report-modal .modal-body').empty().html(message);
    //     $('#report-modal').modal('show');
    //   });
    //
    //   // var message = "<div><object data='../"+$(this).data('report')+"'/></div>";
    //   // $('#report-modal .modal-body').empty().html(message);
    //   // $('#report-modal').modal('show');
    // });

    $(document).on('click', '.js-re-run-test', function (e) {
      e.preventDefault();

      console.log($(this).data('module'));
      // console.log($(this).data('program'));
      var programId = $(".js-form-run-test input[name=program_id]").val();

      $(".js-form-run-test input[name=testcase_id]").val($(this).data('testcase'));
      $(".js-form-run-test input[name=testcase_module]").val($(this).data('module'));
      $(".js-form-run-test").attr("action", "/program/"+programId+"/retest");
      $(".js-form-run-test").submit();

    });

  }
});

$(document).ready(function(){

  if ($('.js-testcases-by-program').length >0 ){

    // $('.js-write-testcase').click(function(e){
    $(document).on("click", ".js-write-testcase", function(e){
      e.preventDefault();
      var programId = $(this).data('program-id');
      var type = $(this).data('type');
      // console.log("programId : "+programId+ " type: "+type);

      //display progress div or message
      displayMessage({'status':true, 'message':'Writing of testcases in progress.'});

      //post to management/testcases/write/programid
      $.post( "/management/testcases/write", {"programid" : programId, "type": type}, function( response ) {
        console.log(response[0]);
        displayMessage(response[0]);
      });

    });

    var displayMessage = function(response){
      var status = (response.status == true)?"success":"danger";
      var callout = "<div class='callout callout-"+status+"'><h4>"+response.message+"</h4></div>";
      $('.js-message').empty().append(callout);
      $('html,body').animate({
        scrollTop: $('.js-message').offset().top
      }, 1000);
    }

  }

});

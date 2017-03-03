$(document).ready(function(){

  //if($('.js-nsocket').length >0 ){

    console.log('socket activated!');
    //var host = location.origin.replace(/^http/, 'ws')
    //socket = new WebSocket('ws://localhost:8081');
    var ws = new WebSocket('ws://'+window.location.hostname+':3030');
    ws.onmessage = function (event) {
      console.log(event);
      var nobj = JSON.parse(event.data)
      var user = $('.js-username').text();
      if (nobj.user == user){
        //this is the intended user
        if(nobj.status == 'info'){
          console.log(nobj.message);
        } else if(nobj.status == 'success') {
          $('.js-test-status').text(nobj.message);
          console.log(nobj.message);

          //redirect to previous page
          //socket contains a program id
          if(nobj.program!==undefined){
            //check its on the test page
            if((location.href.indexOf(nobj.program+'/test')>-1) || (location.href.indexOf(nobj.program+'/retest')>-1)){
              setTimeout(function(){
                window.location.href = location.href.substring(0, location.href.lastIndexOf("/")+1)
              }, 3000);
            } else if (location.href.indexOf(nobj.program)>-1) {
              //check if from the program page
              setTimeout(function(){
                location.reload();
              }, 3000);
            }
          }
        } else {
          console.log(nobj);
        }
      }
    };
  // }
});

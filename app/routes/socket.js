//check if port is not already open

// wss.on("connection", function(_ws) {
//   ws = _ws;
//   sendSocketMessage({'status': 'info', 'message': 'Connected Server & client', 'user': 'anonymous'});
//   console.log("[NodeJS] websocket connection open");
//   _ws.on("close", function() {
//     console.log("[NodeJS] websocket connection close");
//   });
// });

// var sendSocketMessage = function(param){
//   try {
//     ws.send(JSON.stringify(param));
//   } catch (e) {
//     console.log('No active socket found!');
//     console.log(e);
//   }
// };


Socket = {
  init: function() {
    var WebSocketServer = require('ws').Server
    wss = new WebSocketServer({ port: process.env.SK_PORT });
    ws = null;

    wss.on("connection", function(_ws) {
      ws = _ws;
      Socket.send({'status': 'info', 'message': 'Connected Server & client', 'user': 'anonymous'});
      console.log("[NodeJS] websocket connection open");
      _ws.on("close", function() {
        console.log("[NodeJS] websocket connection close");
      });
    });
  },
  send: function(param) {
    try {
      ws.send(JSON.stringify(param));
    } catch (e) {
      console.log('No active socket found!');
      console.log(e);
    }
  }
}

module.exports = Socket;

var express = require('express');
var http = require('http');
var socket_io = require('socket.io');

var app = express();
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



var server = http.createServer(app);
var io = socket_io.listen(server);
io.set('log level', 1);

server.listen(process.env.PORT || 3000);



io.sockets.on('connection', on_connection);


var all_sockets = [];

function on_connection(client_socket){
  all_sockets.push(client_socket);
  client_socket.emit('welcome', { text: 'welcome dear browser' }); 
    
  client_socket.on('message', function(data){
      for (var i=0; i<all_sockets.length; i++)
        all_sockets[i].emit('new_message', data);
  });

}




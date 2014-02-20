var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var path = require('path');

//express app, serves static files from public dir
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

//create http server instance and hook up socket.io to it
var server = http.createServer(app);
var io = socket_io.listen(server);


// client connections via socket.io
io.sockets.on('connection', function(client_socket){

  //send a welcome when a client connects
  client_socket.emit('welcome', { text: 'welcome' }); 
    
  //when a message comes in from a client, braodcast it to every client
  client_socket.on('message', function(data){
    io.sockets.emit('new_message', data);
  });

});


//start the server...
server.listen(process.env.PORT || 3000);

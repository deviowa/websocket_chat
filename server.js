var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var path = require('path');
var _ = require('underscore');

//express app, serves static files from public dir
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

//create http server instance and hook up socket.io to it
var server = http.createServer(app);
var io = socket_io.listen(server);

//keep track of all the chat users
chat_clients = {};

// client connections via socket.io
io.sockets.on('connection', function(socket){

  //send a welcome when a client connects
  socket.emit('welcome', { text: 'welcome', users: chat_clients }); 
 
  //sent by the client to identify itself
  socket.on('nick', function(data){
    chat_clients[socket.id] = data;
    io.sockets.emit('user_join', data);
  });

  //when a message comes in from a client, braodcast it to every client
  socket.on('message', function(data){
    io.sockets.emit('new_message', data);
  });

});


//start the server...
server.listen(process.env.PORT || 3000);


$(document).ready(function(){
  bootbox.prompt("What is your name?", join_chat);
});


function join_chat(nickname){
  
  /***********************************************
   * initialize socket connection for chat
   **********************************************/
  
  //if no nickname was given...kepp asking instead
  if (!nickname)
    return bootbox.prompt("You must choose a nickname?", join_chat);

  //connect using socket.io
  write_output('>> connecting...');
  var socket = io.connect('/');

  //send our nickname
  socket.emit('nick', nickname);

  pageOpen();

  /***********************************************
   * chat protocol / socket.io event handlers
   **********************************************/

  socket.on('welcome', on_welcome);
  socket.on('new_message', on_new_message);
  socket.on('user_join', on_user_join);
  socket.on('user_disconnected', on_user_leave);
 
  //server sends a welcome when we connect successfully
  function on_welcome(data){
    write_output('>> connected successfully');
    console.log("other users:", data.users);
    for(var i = 0; i < data.users.length; i++){
      addUser(data.users[i]);
    }
  }

  function on_user_join(data){
    write_output('>> '+data+" has joined the chat");
    addUser(data);
  }

  function on_user_leave(data) {
    write_output('>> '+data+' has left the chat');
    removeUser(data);
  }

  //new chat message from the server
  function on_new_message(data){
    var new_msg = $("<p><b>"+data.nick+":</b> "+data.text+"</p>");
    $("#output").append(new_msg);
    var objDiv = document.getElementById("output");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  function addUser(name){
    $("#user-list").append($('<p id='+name+'>'+name+'</p>'));
  }

  function removeUser(name){
    $("#"+name).remove();
  }


  /**********************************************
   * DOM event handlers & helpoers
   **********************************************/

  $("#send_button").click( function(ev){
    ev.preventDefault();
    send_message();
  });

  // write a line of outut to the chat window
  function write_output(text){
    var line = $("<p>"+text+"</p>");
    $("#output").append(line);
  }

  //send a message with the text enetred by the user
  function send_message(){
    //get the text enetered in teh input field
    var input_el = $("#input");
    var input_text = input_el.val();

    //send message to server
    socket.emit('message', {nick: nickname, text: input_text});

    //reset input field
    input_el.val('');
  }

}

var pageOpen = function(){
  $(".container").slideDown(500);
  setTimeout(function(){$("#user-list").css("left", "0");}, 500);
  setTimeout(function(){$(".input-fields").css("top", "0");}, 1000);
  setTimeout(function(){$(".input-fields").css("z-index", "0");}, 2000);
  setTimeout(function(){$("#user-list").css("z-index", "0");}, 2000);
  setTimeout(function(){$("#input-chat").removeClass("col-md-8").addClass("col-md-11");}, 2000);
  setTimeout(function(){$("#input").focus();}, 2100);

}














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


  /***********************************************
   * chat protocol / socket.io event handlers
   **********************************************/
  socket.on('welcome', on_welcome);
  socket.on('new_message', on_new_message);
 
  //server sends a welcome when we connect successfully
  function on_welcome(event_data){
    write_output('>> connected successfully');
    write_output('>> welcome '+nickname);
  }

  //new chat message from the server
  function on_new_message(data){
    var new_msg = $("<p><b>"+data.nick+":</b> "+data.text+"</p>");
    $("#output").append(new_msg);
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

$(document).ready(function(){
  bootbox.prompt("What is your name?", join_chat);
});

function join_chat(nickname){
  if (!nickname)
    return bootbox.prompt("You must choose a nickname?", join_chat);

  write_output('>> connecting...');
  var socket = io.connect('/');
  socket.on('welcome', on_welcome);
  socket.on('new_message', on_new_message);

  function write_output(text){
    var new_msg = $("<p>"+text+"</p>");
    $("#output").append(new_msg);
  }

  function on_welcome(event_data){
    write_output('>> connected successfully');
    write_output('>> welcome '+nickname);
  }

  function on_new_message(event_data){
    write_output(event_data.text);
  }

  $("#send_button").click( function(ev){
    var input_text = $("#input").val();
    socket.emit('message', {text: input_text});
    $("#input").val('');
    ev.preventDefault();
    console.log(input_text);
  });
}

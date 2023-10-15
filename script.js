var name="";

while(name == "")
{
  name=prompt("Enter your Name...");
}


function main() {
 
  var socket = io();
  var chatDiv = document.getElementById('chat');
  var input = document.getElementById('message');
  var button = document.getElementById('submit');
  socket.emit("user joined", "<span style='color:orange'>"+name+"</span> joined");
  function handleSubmit() {
      var val = "<<span style='color:orange'>"+name+"</span>> "+input.value;
     
      socket.emit("send message", val);
      
  }
  button.onclick = handleSubmit;
  function handleMessage(msg) {
    var p = document.createElement('h4');
    p.innerHTML = msg;
    console.log(msg)
    chatDiv.appendChild(p);
    input.value = "";
}

socket.on('display message', handleMessage);
socket.on('user joined', handleMessage);
}

window.onload = main;   
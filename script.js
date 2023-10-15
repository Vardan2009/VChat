var name="";

var replyingTo = {};

//sounds and stuff
var notif_sound = new Audio("sounds/notif.mp3")


while(name == "")
{
  name=prompt("Enter your Name...");
}

function smoothScrollToBottom() {
  var chatDiv = document.getElementById('chat');
  const scrollHeight = chatDiv.scrollHeight;
  const duration = 500;

  let startTime;
  function scroll(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      chatDiv.scrollTop = easeInOut(elapsed, chatDiv.scrollTop, scrollHeight, duration);

      if (elapsed < duration) {
          requestAnimationFrame(scroll);
      }
  }

  function easeInOut(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(scroll);
}

function reply(data)
{

  replyingTo = {sender:data}
  updateReplyingText()
}


function updateReplyingText()
{
  if(replyingTo.sender == undefined)
  {
    document.getElementById("replying").innerHTML = "";
  }
  else
  {
    document.getElementById("replying").innerHTML = "Replying to "+replyingTo.sender+"... <a style='cursor: pointer; color:rgb(0, 128, 255);' onclick='reply(undefined)'>Cancel</a>";
  }
}

function main() {
 
  var socket = io();
  var chatDiv = document.getElementById('chat');
  var input = document.getElementById('message-input');
  var button = document.getElementById('send-button');
  socket.emit("user joined", {sender:name});
  function handleSubmit() {
     // var val = "<<span style='color:orange'>"+name+"</span>> "+input.value;
      if(input.value!="")
      {

        socket.emit("send message", {sender:name,message:input.value,replyingTo:replyingTo});
      }
        
      replyingTo = {};
      updateReplyingText()
      input.value = "";
  }
 button.onclick = handleSubmit;
 input.onkeyup =function(key){
 if(key.key == "Enter")
 {
  handleSubmit();
 }

 const messageInput = document.getElementById('message-input');

let typingTimer;

messageInput.addEventListener('keydown', () => {
    clearTimeout(typingTimer);
    socket.emit("typing", {user:name,typing:true});
});

messageInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
    socket.emit("typing", {user:name,typing:false});
    }, 1000); 
});
 };
 
 const typingStatus = document.getElementById('typing');
function handleTyping(data)
{

  if(data.user != name)
  {
    if(data.typing)
      typingStatus.innerHTML = data.user+" is typing...";
    else
      typingStatus.innerHTML = "";
  }
}

function handleJoined(data)
{

 var p = document.createElement('h3');
 p.style="text-align: center;";
 p.classList.add("anim-fromRight");

 p.innerHTML = "<span style='color:#0056b3'>"+data.sender+"</span> Joined";
 chatDiv.appendChild(p);
 smoothScrollToBottom();
}
  function handleMessage(data) {

    var p = document.createElement('div');
    p.classList.add("message");
    if(data.sender == name)
    {
      p.classList.add("anim-fromRight");
      p.classList.add("me");

      if(data.replyingTo.sender == undefined)
      {
        p.innerHTML = "<div class='sender sme'>"+data.sender+"</div><div class='text'><a style='cursor:pointer' onclick=\"reply('"+data.sender+"')\">"+data.message+"</a></div>";
      }
      else
      {
        p.innerHTML = "<div class='sender sme'>"+data.sender+" > "+data.replyingTo.sender+"</div><div class='text'><a style='cursor:pointer' onclick=\"reply('"+data.sender+"')\">"+data.message+"</a></div>";
      }
    
    }
    else
    {
      p.classList.add("anim-fromLeft");

      if(data.replyingTo.sender == undefined)
      {
        p.innerHTML = "<div class='sender'>"+data.sender+"</div><div class='text'><a onclick='reply("+data+")'><a style='cursor:pointer' onclick=\"reply('"+data.sender+"')\">"+data.message+"</a></div>";
      }
      else
      {
        p.innerHTML = "<div class='sender'>"+data.sender+" > "+data.replyingTo.sender+"</div><div class='text'><a style='cursor:pointer' onclick=\"reply('"+data.sender+"')\">"+data.message+"</a></div>";
      }
     
    }

    notif_sound.play()
    chatDiv.appendChild(p);
    smoothScrollToBottom();
}

socket.on('display message', handleMessage);
socket.on('user joined', handleJoined);
socket.on('display typing', handleTyping);
}

window.onload = main;   

document.addEventListener('DOMContentLoaded', ()=>{
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure chat box
  socket.on('connect', ()=>{

    // input text should submit an emit event
    let $chatBoxForm = document.querySelector('#chatBoxForm');
    let $chatBoxInput = document.querySelector('#chatBoxInput');
    $chatBoxForm.onsubmit = () =>{
      const message = $chatBoxInput.value;
      socket.emit('post message', {"message": message});
    }
  });

  // When a new message is posted, add to ul
  socket.on('all messages', data =>{
    const li = document.createElement('li');
    li.innerHTML = data.message;
    document.querySelector('#chatMessages').appendChild(li);
  });
});
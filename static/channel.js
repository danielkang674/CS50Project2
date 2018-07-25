document.addEventListener('DOMContentLoaded', ()=>{

  // Check for display name
  let displayName;
  let $container = document.querySelector('div.container');
  if(!localStorage.getItem('displayName')){
    $container.innerHTML = '';
    let $displayNameForm = document.createElement('form');
    let $displayNameInput = document.createElement('input');
    const h1 = document.createElement('h1');
    h1.innerHTML = 'Create your display name!'
    $displayNameInput.setAttribute('type', 'text');
    $displayNameInput.setAttribute('id', 'displayNameInput');
    $displayNameInput.setAttribute('placeholder', 'Make a display name!');
    $displayNameForm.appendChild($displayNameInput);
    $displayNameForm.onsubmit = () =>{
      localStorage.setItem('displayName', $displayNameInput.value);
      window.location.reload(true);
    }
    $container.appendChild(h1);
    $container.appendChild($displayNameForm);
  } else {
    displayName = localStorage.getItem('displayName');
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure chat box
    socket.on('connect', ()=>{
      // join a room
      socket.emit('join', {"displayName": displayName});

      // input text should submit an emit event
      let $chatBoxInput = document.querySelector('#chatBoxInput');
      let $chatBoxBtn = document.querySelector('#chatBoxBtn');
      $chatBoxBtn.onclick = () =>{
        const message = $chatBoxInput.value;
        const timestamp = new Date().toString();
        const endIndex = timestamp.indexOf('GMT');
        socket.emit('post message', {"message": message, "displayName": displayName, "timestamp": timestamp.slice(4, endIndex)});
        $chatBoxInput.value = '';
      }
      $chatBoxInput.addEventListener('keyup', (event)=>{
        // don't submit form
        event.preventDefault();
        // check if enter key
        if(event.key === "Enter"){
          $chatBoxBtn.click();
        }
      });

    });

    // When disconnected
    socket.on('disconnect', ()=>{
      socket.emit('leave', {"displayName": displayName});
    });

    // When a new message is posted, add to ul
    socket.on('all messages', data =>{
      const div = document.createElement('div');
      div.innerHTML = `<p class="timestamp">${data.timestamp}</p><p class="message">${data.displayName}: ${data.message}</p>`;
      div.className = 'alert alert-info';
      document.querySelector('#chat-window').appendChild(div);
    });

    socket.on('joined room', data =>{
      const div = document.createElement('div');
      div.innerHTML = data;
      div.className = 'alert alert-primary';
      document.querySelector('#chat-window').appendChild(div);
    });

    socket.on('left room', data =>{
      const div = document.createElement('div');
      div.innerHTML = data;
      div.className = 'alert alert-danger';
      document.querySelector('#chat-window').appendChild(div);
    });
  }
});
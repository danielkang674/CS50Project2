document.addEventListener('DOMContentLoaded', ()=>{

  // Check for display name
  let displayName;
  if(!localStorage.getItem('displayName')){
    document.body.innerHTML = '';
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
    document.body.appendChild(h1);
    document.body.appendChild($displayNameForm);
  }
    displayName = localStorage.getItem('displayName');
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure chat box
    socket.on('connect', ()=>{

      socket.emit('join', {"displayName": displayName})

      // input text should submit an emit event
      let $chatBoxForm = document.querySelector('#chatBoxForm');
      let $chatBoxInput = document.querySelector('#chatBoxInput');
      $chatBoxForm.onsubmit = () =>{
        const message = $chatBoxInput.value;
        socket.emit('post message', {"message": message, "displayName": displayName});
      }
    });

    // When a new message is posted, add to ul
    socket.on('all messages', data =>{
      const li = document.createElement('li');
      li.innerHTML = `${data.displayName}: ${data.message}`;
      document.querySelector('#chatMessages').appendChild(li);
    });
});
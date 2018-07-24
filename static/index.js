document.addEventListener('DOMContentLoaded', ()=>{

  if(localStorage.getItem('displayName') && localStorage.getItem('channel')){
    let channel = localStorage.getItem('channel');
    window.location.href = `channel/${channel}`
  }

  // declare variables
  let displayName;
  let $container = document.querySelector('div.container');
  const h1 = document.createElement('h1');

  // Check for display name
  if(!localStorage.getItem('displayName')){
    $container.innerHTML = '';
    let $displayNameForm = document.createElement('form');
    let $displayNameInput = document.createElement('input');
    h1.innerHTML = 'Create your display name!'
    $displayNameInput.setAttribute('type', 'text');
    $displayNameInput.setAttribute('id', 'displayNameInput');
    $displayNameInput.setAttribute('placeholder', 'Make a display name!');
    $displayNameForm.appendChild($displayNameInput);
    $displayNameForm.onsubmit = () =>{
      localStorage.setItem('displayName', $displayNameInput.value);
      window.location.replace('channel/cuz');
    }
    $container.appendChild(h1);
    $container.appendChild($displayNameForm);
  } else {
    displayName = localStorage.getItem('displayName');
    h1.innerHTML = `Hi ${displayName} <button id="logout" class="btn btn-dark">Logout?</button>`;
    $container.prepend(h1);
    document.querySelector('#logout').onclick = () =>{
      localStorage.removeItem('displayName');
      window.location.reload(true);
    }
    document.querySelectorAll('li.list-group-item').forEach(link=>{
      link.onclick = () =>{
        localStorage.setItem('channel', link.dataset.room);
      }
    });
  }
});
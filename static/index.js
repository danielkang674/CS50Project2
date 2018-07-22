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
  } else {
    displayName = localStorage.getItem('displayName');
  }
});
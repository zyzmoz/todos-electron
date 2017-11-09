const electron = require('electron');
const { ipcRenderer } = electron;

window.onload = () =>{
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const form = document.querySelector('form').elements;

    let data = {};
    for (var i = 0; i < form.length; i++) {
      if (form[i].localName === 'input') {
        data[form[i].name] = form[i].value;
        console.log(form[i].name, form[i].value);
      }
    }

    ipcRenderer.send('todo:add', data);
  });
}

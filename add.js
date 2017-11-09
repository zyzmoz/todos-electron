const electron = require('electron');
const { ipcRenderer } = electron;

window.onload = () =>{
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(document.querySelector('form'));
    let data = new FormData();
    console.log(data);
    ipcRenderer.send('todo:submit', data);
  });
}

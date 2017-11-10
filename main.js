const electron = require('electron');
const { ipcRenderer } = electron;
let todoList = [];
window.onload = () => {
  ipcRenderer.send('todos:query');
}

ipcRenderer.on('todos:add', (event, data) => {
  todoList.push(data);
  loadTodos();
});

ipcRenderer.on('todos:query', (event, data) => {
  todoList = data;
  loadTodos();
});

ipcRenderer.on('todos:clear', () => {
  document.querySelector('ul').innerHTML = '';
});

function loadTodos(){
  let items = '';
  for (i in todoList) {
    items += '<li><div class="col-75">'+ todoList[i].todo +'</div><button class="btn danger" onClick="deleteTodo('+todoList[i]._id+')">Remove</button></li>'
    console.log(items);
  }
  document.querySelector('ul').innerHTML = items;
}

function deleteTodo(index) {
  let removeIndex = todoList.map((item) => {
    console.log(item._id);
    return item._id;
  }).indexOf(index);

  todoList.splice(removeIndex,1);

  ipcRenderer.send('todo:delete', index);

  loadTodos();
}

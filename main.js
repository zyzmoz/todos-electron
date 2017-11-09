const electron = require('electron');
const { ipcRenderer } = electron;
let todoList = [];
window.onload = () => {
  ipcRenderer.send('todos:query');
}

ipcRenderer.on('todos:add', (event, data) => {
  
  // const li = document.createElement('li');
  // const text = document.createTextNode(data.todo);
  // li.appendChild(text);
  // document.querySelector('ul').appendChild(li);
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
    items += '<li>'+ todoList[i].todo +'<button onClick="deleteTodo('+todoList[i]._id+')">Remove</button></li>'
    console.log(items);
  }
  document.querySelector('ul').innerHTML = items;
}

function deleteTodo(index) {
  let removeIndex = todoList.map((item) => {
    console.log(item._id);
    return item._id;
  }).indexOf(index);

  ipcRenderer.send('todo:delete', index);

  loadTodos();
}

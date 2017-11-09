const electron = require('electron');
const { ipcRenderer } = electron;
let todoList = [];
window.onload = () => {
}

ipcRenderer.on('todos:add', (event, data) => {
  todoList.push(data);
  // const li = document.createElement('li');
  // const text = document.createTextNode(data.todo);
  // li.appendChild(text);
  // document.querySelector('ul').appendChild(li);
  let items = '';
  for (i in todoList) {
    items += '<li>'+ todoList[i].todo +'<button onClick(deleteTodo('+todoList[i]._id+'))>Delete</button></li>'
    console.log(items);
  }
  document.querySelector('ul').innerHTML = items;
  console.log(todoList);
});

ipcRenderer.on('todos:clear', () => {
  document.querySelector('ul').innerHTML = '';
});

function deleteTodo(index) {
  let removeIndex = todoList.map((item) => {
    console.log(item._id);
    return item._id;
  }).indexOf(index);

  todoList.splice(removeIndex,1);

  let items = '';
  for (i in todoList) {
    items += '<li>'+ todoList[i].todo +'</li>'
    console.log(items);
  }
  document.querySelector('ul').innerHTML = items;
}

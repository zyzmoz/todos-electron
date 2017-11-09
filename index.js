const electron = require('electron');
const todoRef = require('./firebase');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html` );


  mainWindow.on('closed', () => app.quit());

  //Custom menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  // mainWindow.webContents.openDevTools();
});

ipcMain.on('todos:query', () => {
  todoRef.on('value', snap => {
    let todos = [];
    snap.forEach(item => {
      console.log(item);
      let todoObj = item.val();
      const { _id, todo } = todoObj;
      todos.push({ _id, todo});
    });
    console.log(todos);
    mainWindow.webContents.send('todos:query', todos);
  });
});

ipcMain.on('todo:delete', (event, index) =>{
  var query = todoRef.orderByChild('_id').equalTo(index);
  debugger
  query.on('child_added', function(snapshot) {
    snapshot.ref.remove();
  });
});

ipcMain.on('todo:add', (event, data) => {
  data._id = Math.random();
  console.log(data);
  todoRef.push(data);
  addWindow.close();
  mainWindow.webContents.send('todos:add', data);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    modal: true,
    parent: mainWindow,
    minimizable: false,
    maximizable: false,
    width: 300,
    height: 160,
    title: "Add New Todo"
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  if (process.env.NODE_ENV === 'production')
    addWindow.setMenu(null);

  addWindow.on('closed', () => {
    addWindow = null
  });

}

const menuTemplate = [
  {
    label: "File",
    submenu: [{
      label: "New Todo",
      click() {
        createAddWindow();
      }
    },
    {
      label: "Clear Todos",
      click() {
        mainWindow.webContents.send('todos:clear', '');
      }
    },
    {
      label: "Quit",
      accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }]
  }
];

//When iOS add an empty item menu
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}


//Environment mode
// 'production'
// 'development'
// 'staging'
// 'test'
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload'},
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+U' : 'Ctrl+U',
        click(item, focusedItem) {
          focusedItem.toggleDevTools();
        }
      }
    ]
  })
}

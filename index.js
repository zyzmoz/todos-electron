const electron = require('electron');
const todoAction = require('./firebase');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({icon: `${__dirname}/assets/icons/notepad.png` });
  mainWindow.loadURL(`file://${__dirname}/main.html` );


  mainWindow.on('closed', () => app.quit());

  //Custom menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

});

ipcMain.on('todos:query', () => {
  todoAction.query('').then((res) =>{
    mainWindow.webContents.send('todos:query', res);
  });
});

ipcMain.on('todo:delete', (event, index) =>{
  todoAction.delete(index);
});

ipcMain.on('todo:add', (event, data) => {
  data._id = Math.random();
  todoAction.save(data);
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
    height: 180,
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
        todoAction.deleteAll();
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

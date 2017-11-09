const electron = require('electron');
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
  mainWindow.webContents.openDevTools();
});

ipcMain.on('todo:submit', (event, data) => {
  console.log(data);
  //addWindow.close();
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
  addWindow.setMenu(null);
   addWindow.webContents.openDevTools();
}

const menuTemplate = [
  {
    label: "File",
    submenu: [{
      label: "New Todo",
      click() {
        createAddWindow();
      }
    }, {
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

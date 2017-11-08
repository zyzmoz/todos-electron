const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html` );
  //Custom menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.webContents.openDevTools();
});

const menuTemplate = [
  {
    label: "File",
    submenu: [{
      label: "New Todo"
    }, {
      label: "Quit",
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

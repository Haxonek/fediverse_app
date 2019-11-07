// Modules to control application life and create native browser window
const electron = require("electron");
const path = require('path')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let menu

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: "Fediverse",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
        mainWindow = null
  })

  var template = [
        {
          label: 'Fediverse',
          submenu: [
              {
                  label: 'About Electron',
                  selector: 'orderFrontStandardAboutPanel:'
              },
              {
                  type: 'separator'
              },
              {
                  label: 'Services',
                  submenu: []
              },
              {
                  type: 'separator'
              },
              {
                  label: 'Hide',
                  accelerator: 'Command+H',
                  selector: 'hide:'
              },
              {
                  label: 'Hide Others',
                  accelerator: 'Command+Shift+H',
                  selector: 'hideOtherApplications:'
              },
              {
                  label: 'Show All',
                  selector: 'unhideAllApplications:'
              },
              {
                  type: 'separator'
              },
              {
                  label: 'Quit',
                  accelerator: 'Command+Q',
                  click: function() { app.quit(); }
              },
          ]},
          {
              label: 'Instances',
              submenu: [
                  {label:'Home', click() {mainWindow.loadFile('index.html')}},
                  {type:'separator'},
                  {label:'Mastodon', click() {rebuildWindow('https://mastodon.social/')}},
                  {label:'Pawoo', click() {rebuildWindow('https://pawoo.net/')}},
                  {label:'Mstdn', click() {rebuildWindow('https://mastdn.social/')}},
                  {label:'Socialhome', click() {rebuildWindow('https://socialhome.network/')}},
                  {label:'Pixelfed', click() {rebuildWindow('https://pixelfed.org/')}},
                  {label:'Gab', click() {rebuildWindow('https://gab.com/')}},
                  {type:'separator'},
              ]
          },
          {
              label: 'Edit',
              submenu: [
                  {
                      label: 'Undo',
                      accelerator: 'Command+Z',
                      selector: 'undo:'
                  },
                  {
                      label: 'Redo',
                      accelerator: 'Shift+Command+Z',
                      selector: 'redo:'
                  },
                  {
                      type: 'separator'
                  },
                  {
                      label: 'Cut',
                      accelerator: 'Command+X',
                      selector: 'cut:'
                  },
                  {
                      label: 'Copy',
                      accelerator: 'Command+C',
                      selector: 'copy:'
                  },
                  {
                      label: 'Paste',
                      accelerator: 'Command+V',
                      selector: 'paste:'
                  },
                  {
                      label: 'Select All',
                      accelerator: 'Command+A',
                      selector: 'selectAll:'
                  },
              ]},
              {
                  label: 'View',
                  submenu: [
                      {
                          label: 'Reload',
                          accelerator: 'Command+R',
                          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
                      },
                  ]
              },
              {
                  label: 'Window',
                  submenu: [
                      {
                          label: 'Minimize',
                          accelerator: 'Command+M',
                          selector: 'performMiniaturize:'
                      },
                      {
                          label: 'Close',
                          accelerator: 'Command+W',
                          selector: 'performClose:'
                      },
                      {
                          type: 'separator'
                      },
                      {
                          label: 'Bring All to Front',
                          selector: 'arrangeInFront:'
                      },
                  ]
              },
              {
                  label: 'Help',
                  submenu: []
              },
          ];
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// set up web instance
ipc.on('connect-to-instance', function(event, instanceURL) {
    if (instanceURL.includes('http:') || instanceURL.includes('https:')) {
        rebuildWindow(instanceURL)
    } else {
        rebuildWindow("https://" + instanceURL)
    }
})

// replace window with instance
function rebuildWindow(instanceURL) {
    console.log(instanceURL)
    mainWindow.close() // there must be a better way to do this lol
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadURL(instanceURL)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

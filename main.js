const {app, BrowserWindow} = require('electron');
const path = require('path');
const Save = require('./fileConstructor.js');
const {ipcMain} = require('electron');
const fs = require('fs');

let labyrinth_window;

function createWindow() {
    labyrinth_window = new BrowserWindow({
        width: 1366,
        height: 768,

        frame: false,
        fullscreen: true,

        show: false,
        resizable: false,
        alwaysOnTop: true,

        title: "Keeper of the Labyrinth",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })    
    labyrinth_window.loadFile('labyrinth.html')
    labyrinth_window.once('ready-to-show', () => {
        labyrinth_window.show()
      })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    //if (process.platform !== 'darwin') {
        app.quit()
    //}
}) 

let latestSave = new Save({
    configName: 'save',
    default: ''
})
fs.readFile(latestSave.path,'utf8',function(err,data){
    if (err===null) {
        latestSave.data = JSON.parse(data)
    } else {
        latestSave.data = ''
    }
})

ipcMain.on('saveData', (event,arg)=>{
    latestSave.set(JSON.stringify(arg))
})

ipcMain.on('adjustOptions',(event,opts)=>{

})

ipcMain.on('requestOptions',(event)=>{

})

ipcMain.on('requestSaveData',(event)=>{
    let latest = latestSave.data;
    //let win = BrowserWindow.getAllWindows()[0]
    if (latestSave.data !== '' && latest !== undefined) {
        labyrinth_window.webContents.send('recieveSaveData',latestSave.data)
    } else {
        labyrinth_window.webContents.send('recieveSaveData',false)
    }
})

ipcMain.on('quitGame',(event)=>{
    labyrinth_window.close();
})
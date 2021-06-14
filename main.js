const {app, BrowserWindow} = require('electron');
const path = require('path');
const Save = require('./fileConstructor.js');
const {ipcMain} = require('electron');
const fs = require('fs');

let labyrinth_window;

function createWindow() {
    labyrinth_window = new BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })    
    labyrinth_window.loadFile('labyrinth.html')
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

ipcMain.on('saveData', (event,arg)=>{
    latestSave.set(JSON.stringify(arg))
})

ipcMain.on('saveOptions',(event,arg)=>{

})

ipcMain.on('requestOptions',(event)=>{

})

ipcMain.on('requestSaveData',(event)=>{
    let latest = latestSave.data;
    //let win = BrowserWindow.getAllWindows()[0]
    if (latest !== '') {
        console.log(latestSave.data,'from main')
        labyrinth_window.webContents.send('recieveSaveData',latestSave.data)
    } else {
        labyrinth_window.webContents.send('recieveSaveData',false)
    }
})
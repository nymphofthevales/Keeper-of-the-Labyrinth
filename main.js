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
    defaults: ''
})
let masterSave = new Save({
    configName: 'master',
    defaults: `{}`
})
let optSave = new Save({
    configName: 'options',
    defaults: "{\"textSize\": \"default\",\"enableMusic\": true,\"volume\": 25,\"enableParallax\": true,\"enableWarnings\": false}"
})
fs.readFile(latestSave.path,'utf8',function(err,data){
    if (err===null) {
        latestSave.data = JSON.parse(data)
    } else {
        latestSave.data = ''
    }
})
fs.readFile(masterSave.path,'utf8',function(err,data){
    if (err===null) {
        masterSave.data = JSON.parse(data)
    } else {
        masterSave.data = `{}`;
    }
})
fs.readFile(optSave.path,'utf8',function(err,data){
    if (err===null) {
        optSave.data = JSON.parse(data)
    } else {
        optSave.data = ''
    }
})

ipcMain.on('saveData', (event,arg)=>{
    latestSave.set(JSON.stringify(arg))
})

ipcMain.on('adjustOptions',(event,arg)=>{
    optSave.set(JSON.stringify(arg))
})

ipcMain.on('updateMasterSave',(event,arg)=>{
    let currentDate = new Date;
    let timestamp = `${currentDate.getFullYear()}/${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getTime()}`;
    let currentData = Object.assign({},JSON.parse(masterSave.data));
    //console.log(`input of data at updateMasterSave: ${masterSave.data}, as ${typeof masterSave.data}`)
    currentData[timestamp] = arg;
    masterSave.set(JSON.stringify(currentData));
    //console.log(`output at updateMasterSave: ${JSON.stringify(currentData)}, as ${typeof JSON.stringify(currentData)}`)
})
ipcMain.on('setMasterSave',(event,arg)=>{
    console.log(`master save was set to: ${JSON.stringify(arg)}`)
    masterSave.set(JSON.stringify(arg));
})

ipcMain.on('requestOptions',(event)=>{
    if (optSave.data !== '' && optSave.data !== undefined) {
        labyrinth_window.webContents.send('recieveOptions',[true,JSON.parse(optSave.data)])
    } else {
        labyrinth_window.webContents.send('recieveOptions',[false,JSON.parse(optSave.defaults)])
    }
})

ipcMain.on('requestSaveData',(event)=>{
    if (latestSave.data !== '' && latestSave.data !== undefined) {
        labyrinth_window.webContents.send('recieveSaveData',latestSave.data)
    } else {
        labyrinth_window.webContents.send('recieveSaveData',false)
    }
})
ipcMain.on('requestMasterSave',(event)=>{
    //console.log(`input of data at requestMasterSave: ${masterSave.data}, as ${typeof masterSave.data}`)
    if (masterSave.data !== {} || JSON.stringify(masterSave.data) !== '{}' && masterSave.data !== undefined) {
        labyrinth_window.webContents.send('recieveMasterSave',JSON.parse(masterSave.data))
    } else {
        labyrinth_window.webContents.send('recieveMasterSave',false)
    }
})

ipcMain.on('quitGame',(event)=>{
    labyrinth_window.close();
})
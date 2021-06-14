const electron = require('electron');
const path = require('path')
const fs = require('fs')
const {ipcRenderer} = require('electron');

let data = {
    //json 
    current: 'title',
    page: 1,
    visited: ['a','b','c']
}

//ipcRenderer.send('saveData',data)
ipcRenderer.send('requestSaveData')

ipcRenderer.on('recieveSaveData',(event,data)=>{
    if (data !== false) {
        console.log(data)
    } else if (data === false) {
        console.log("no save created")
    }
})
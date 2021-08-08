'use strict'
const electron = require('electron');
const path = require('path')
const fs = require('fs')
const {ipcRenderer} = require('electron');
let hasSavedData = false;
let preloadCurrent = undefined;
let savedPageInstance = intro;
let overlayOpen = false;
let mainMenuOpen = true;
let ingameMenuOpen = false;
let page = 0;
let masterSave = {};

getSaveData();
getSavedOptions();
getMasterSave();

function getSaveData() {
    ipcRenderer.send('requestSaveData')
    console.log('requesting save data...')
    ipcRenderer.on('recieveSaveData',(event,data)=>{
        if (data !== false) {
            console.log(`save found, recieved ${data}`)
            hasSavedData = true;
            loadData(data)
        } else if (data === false) {
            console.log(`no save available, got ${data}`)
            hasSavedData = false;
        }
    })
}

function getSavedOptions() {
    ipcRenderer.send('requestOptions')
    console.log('requesting saved options...')
    ipcRenderer.on('recieveOptions',(event,data)=>{
        if (data[0] === true) {
            options = data[1];
            setOptionsForm();
            manageTextOptions();
            console.log(`got options, recieved: ${JSON.stringify(data[1])}`)
        } else if (data[0] === false) {
            options = data[1];
            console.log(`no saved options, loaded defaults: ${JSON.stringify(data[1])}`)
        }
    })
}

function getMasterSave() {
    ipcRenderer.send('requestMasterSave')
    console.log('requesting master save...')
    ipcRenderer.on('recieveMasterSave',(event,data)=>{
        if (data !== false) {
            masterSave = Object.assign({},data);
            return masterSave;
            //console.log(`input of data at recieveMasterSave: ${data}, as ${typeof data}`)
        } else if (data === false) {
            masterSave = Object.assign({},data);
            return false;
            //console.log(`input of data at recieveMasterSave: ${data}, as ${typeof data}`)
        }
    })
}

function saveParameters(){
    save(preloadCurrent,page)
}
function save(current,savedPage) {
    if (savedPage === undefined) {
        savedPage = 0;
    }
    let savedVisitedArray = [];
    if (visited.length > 0) {
        for (let i=0; i<visited.length; i++) {
            savedVisitedArray.push(visited[i]);
        }
    }
    let template = {"title":`${current.title}`,"page":savedPage,"visited":savedVisitedArray}
    ipcRenderer.send('saveData',template);
    ipcRenderer.send('updateMasterSave',template)
}
function loadData(data) {
    let savedData = JSON.parse(data);
    page = savedData.page;
    visited = savedData.visited;
    let PageInstances = SequenceInstances.concat(StoryNodeInstances);
    for (let i=0; i<PageInstances.length; i++) {
        if (PageInstances[i].title === savedData.title) {
            savedPageInstance = PageInstances[i];
        }
    }
};

function sortSaveObject(saveObject) {
    console.log([`Recieved:`, saveObject])
    let iterable = Object.keys(saveObject);
    console.log(iterable);
    let failures = [];
    let successes = [];
    let resultObject = {};

    for (let i = 0; i < iterable.length; i++) {
        for (let l = (i + 1); l < iterable.length; l++) {
            console.log([`comparing`,iterable[i],`to`,iterable[l]])
            let result = pruneSaves(saveObject[iterable[i]],saveObject[iterable[l]],iterable[i],iterable[l])
            for (let j=0; j < result.length; j++) {
                console.log([`pushing to failures object:`,result[j]])
                failures.push(result[j]);
            }
        }
    }
    for (let c = 0; c < iterable.length; c++) {
        let tests = [];
        for (let d = 0; d < failures.length; d++) {
            if (iterable[c] !== failures[d]) {
                tests.push(true)
            } else {
                tests.push(false)
            }
        }
        if (tests.includes(false) === false) {
            successes.push(iterable[c])
        }
    }
    for (let k = 0; k < successes.length; k++) {
        resultObject[successes[k]] = saveObject[successes[k]];
    }
    function pruneSaves(saveA,saveB,identA,identB) {
        let a = saveA.visited;
        let b = saveB.visited;
        let shortest;
        switch (a.length < b.length) {
            case true: shortest = a;
                break;
            case false: shortest = b;
        }
        for (let i=0; i < shortest.length; i++) {
            if (a[i] !== b[i]) {
                //keep both
                return [];
            } else if (a[i] === b[i] && i === (shortest.length-1)){
                switch (a === shortest) {
                    case true: return [identA];
                    case false: if (a.length === b.length) {
                        let timeA = parseInt(identA.split('/')[3]);
                        let timeB = parseInt(identB.split('/')[3]);
                        switch ((timeA - timeB) > 0) {
                            case true: return [identB]
                            case false: return [identA]
                        }
                    } else {
                        return [identB];
                    }
                }
            }
        }
    }
    console.log([`Produced:`,resultObject])
    ipcRenderer.send('setMasterSave',resultObject);
    return resultObject;
}


function sumOfActions(sortedSaveObject) {
    let iterable = Object.keys(sortedSaveObject);
    let summedActions = [];
    for (let i = 0; i < iterable.length; i++) {
        for (let j = 0; j < sortedSaveObject[iterable[i]].visited.length; j++) {
            console.log(sortedSaveObject[iterable[i]].visited[j])
            if (summedActions.includes(sortedSaveObject[iterable[i]].visited[j]) === false) {
                summedActions.push(sortedSaveObject[iterable[i]].visited[j])
            }
        }
    }
    return summedActions;
}
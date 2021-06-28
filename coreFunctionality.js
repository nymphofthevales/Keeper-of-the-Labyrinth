//
//For anything that prints to the document, 
//and their pre-requisite functions for preparing 
//data to be printed.
//

const electron = require('electron');
const path = require('path')
const fs = require('fs')
const {ipcRenderer} = require('electron');

'use strict'

function generateButton(number,text) {
    return `<div class=\"button-housing\" id=\"button-housing-${number}\"><div class=\"left-button-frame\" id=\"button-${number}-left\"></div><button id=\"button-${number}-middle\" class=\"middle-button-frame\"><p id=\"button-text-${number}\">${text}</p></button><div class=\"right-button-frame\" id=\"button-${number}-right\"></div></div>`
}

let page = 0;
//window.onload = () => {
    ipcRenderer.send('requestSaveData')
    console.log('requesting save data...')
//}
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

function print(data,current) {
    //data takes form of [page text string, button string or array] as returned by StoryNode or Sequence .getPage()
    //Sequence.getPage() returns a string, StoryNode an array.
    let textHouse = document.getElementById("text");
    let btnHouse = document.getElementById("buttons");
    textHouse.innerHTML = '';
    btnHouse.innerHTML = '';
    let p = () =>  document.createElement("p");
    //let btn = () => document.createElement("button");
    let text = data[0];
    textHouse.appendChild(p()).id="currentText";
    let currentText = document.getElementById("currentText");
    currentText.innerHTML = text;
    if (typeof data[1] === 'string') {
        //for printing pages from a sequence
        let buttonText = data[1];
        //btnHouse.appendChild(btn()).id="sequenceBtn";
        //let sequenceBtn = document.getElementById("sequenceBtn")
        //sequenceBtn.innerHTML = button;
        btnHouse.innerHTML = generateButton(1,buttonText)
        let sequenceBtn = document.getElementById('button-housing-1')
        initializeButtons()
        listen([sequenceBtn],current)
    } else { 
        //for printing a StoryNode. saves id references in btnRefs array for later use.
        let btnRefs = new Array();
        let currentButtonHtml = ''
        for (let i=0; i<data[1].length; i++) {
            let buttonText = data[1][i];
            currentButtonHtml += generateButton(i+1,buttonText)
        }
        btnHouse.innerHTML = currentButtonHtml;
        initializeButtons()
        for (let i=0; i<data[1].length; i++) {
            let ref = document.getElementById(`button-housing-${i+1}`)
            btnRefs.push(ref)
        }
        listen(btnRefs,current);
    }
};
function manageImage(action,location,url) {
    let top = document.getElementById('top-img');
    let bottom = document.getElementById('bottom-img');
    if (action === 'print') {
        let img = document.createElement('img');
        if (location === 'top') {
            top.appendChild(img).src = url;
        } else if (location === 'bottom') {
            bottom.appendChild(img).src = url;
        };
    } else if (action === 'remove') {
        if (location === 'top') {
            top.innerHTML = '';
        } else if (location === 'bottom') {
            bottom.innerHTML = '';
        } else if (location === 'all') {
            top.innerHTML = '';
            bottom.innerHTML = '';
        }
    }
};
function clearFocus() {
    let clr = document.getElementById('focus-clear');
    clr.focus();
    clr.blur();
}
function genActions(current) {
    manageImage('remove','all','');
    clearFocus();
    visit(current);
    checkSpecialActions(current);
}
function progression(current,destination_button_number) {
    if (current.constructor.name === 'Sequence') {
        if (page >= current.getLength()-1) {
            page = 0;
            current = current.getNext();
            genActions(current);
            print(current.getPage(page),current);
            console.log(`progressed to ${current.title} (${current.constructor.name})`)
        } else if (page <= current.getLength()) {
            page += 1;
            print(current.getPage(page),current)
            console.log(`progressed to ${current.title} ${page}`)
        }
    } else if (current.constructor.name === 'StoryNode') {
        let destination = current.getDestinations()[destination_button_number];
        current = destination;
        genActions(current);
        print(current.getPage(0),current)
        console.log(`progressed to ${current.title} (${current.constructor.name})`)
    }
}
let preloadCurrent = undefined;
function saveParameters(){
    save(preloadCurrent,page)
}
function listen(buttonArray,current) {
    preloadCurrent = current;
     window.onbeforeunload = () => {
        saveParameters()
        return undefined
    }
    document.getElementById('button-housing-13').removeEventListener('click',saveParameters,true)
    document.getElementById('button-housing-13').addEventListener('click',saveParameters,true)
    if (current.constructor.name === 'Sequence') {
        let btn = buttonArray[0];
        btn.addEventListener('click',() => {
            progression(current);
        });
    } else if (current.constructor.name === 'StoryNode') {
        for (let i=0; i<buttonArray.length; i++) {
            buttonArray[i].addEventListener('click',()=>{
                progression(current,i)
            })
        }
    }
}

function hoverOver(action,number) {
    if (action === 'clear') {
        let left = document.querySelectorAll('.left-button-frame');
        let right = document.querySelectorAll('.right-button-frame');
        let middle = document.querySelectorAll('.middle-button-frame')
        for (let i = 0; i < left.length; i++) {
            left[i].style.backgroundImage = "url(\"./assets/ui/button_left_small.png\")"
            right[i].style.backgroundImage = "url(\"./assets/ui/button_right_small.png\")"
            middle[i].style.backgroundImage = "url(\"./assets/ui/button_middle_frame.png\")"
        }
    } else if (action === 'hover') {
        let middle = document.getElementById(`button-${number}-middle`);
        let right = document.getElementById(`button-${number}-right`);
        let left = document.getElementById(`button-${number}-left`);
        middle.style.backgroundImage = "url(\"./assets/ui/button_middle_hover.png\")"
        right.style.backgroundImage = 'url("./assets/ui/button_right_small_hover.png")';
        left.style.backgroundImage = 'url("./assets/ui/button_left_small_hover.png")';
    }
}

function clickButton(number) {
    let middle = document.getElementById(`button-${number}-middle`);
    let left = document.getElementById(`button-${number}-left`);
    let right = document.getElementById(`button-${number}-right`);
    middle.style.backgroundImage = "url(\"./assets/ui/button_middle_active.png\")"
    right.style.backgroundImage = 'url("./assets/ui/button_right_small_active.png")';
    left.style.backgroundImage = 'url("./assets/ui/button_left_small_active.png")';
}

function initializeButtons() {
    let buttons = {}
    let storyButtons = Array.from(document.querySelectorAll('.button-housing'));
    let menuButtons = storyButtons.slice(-4);
    storyButtons.splice(-4,4);

    for (let i=0; i<storyButtons.length; i++) {
        buttons[`button_${i+1}`] = document.getElementById(`button-housing-${i+1}`);
        buttons[`button_${i+1}`].addEventListener('mouseover',()=>{
            hoverOver("hover",i+1);
        });
        buttons[`button_${i+1}`].addEventListener('mouseout',()=>{
            hoverOver("clear",i+1);
        })
        buttons[`button_${i+1}`].addEventListener('mousedown',()=>{
            clickButton(i+1)
        })
        buttons[`button_${i+1}`].addEventListener('mouseup',()=>{
            hoverOver("hover",i+1)
        })
    }
    for (let i=0; i<menuButtons.length; i++) {
        buttons[`button_${i+10}`] = document.getElementById(`button-housing-${i+10}`);
        buttons[`button_${i+10}`].addEventListener('mouseover',()=>{
            hoverOver("hover",i+10);
        });
        buttons[`button_${i+10}`].addEventListener('mouseout',()=>{
            hoverOver("clear",i+10);
        })
        buttons[`button_${i+10}`].addEventListener('mousedown',()=>{
            clickButton(i+10)
        })
        buttons[`button_${i+10}`].addEventListener('mouseup',()=>{
            hoverOver("hover",i+10)
        })
    }
}

function redirect(time,current) {
    console.log(`redirecting to next page in ${time/1000} seconds`)
    setTimeout(()=>{progression(current)},time)
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
    ipcRenderer.send('saveData',{"title":`${current.title}`,"page":savedPage,"visited":savedVisitedArray});
}
function loadData(data) {
    let savedData = JSON.parse(data);
    page = savedData.page;
    visited = savedData.visited;
    let PageInstances = SequenceInstances.concat(StoryNodeInstances);
    for (let i=0; i<PageInstances.length; i++) {
        if (PageInstances[i].title === savedData.title) {
            loadPage(PageInstances[i],page)
        }
    }
};
function loadPage(current,page_number) {
    genActions(current);
    page = page_number
    print(current.getPage(page_number),current);
    console.log(`${current.title} ${page} was loaded`);
};
//popup
function sendLoadPopup() {
    let menu = document.getElementById('popup-menu');
    menu.classList.remove('invisible');
    let yes = document.getElementById('popup-yes');
    let no = document.getElementById('popup-no');
    yes.addEventListener('click',()=>{
        menu.classList.add('invisible');
        runLoadingSequence();
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
    })
    no.addEventListener('click',()=>{
        loadPage(intro,0);
        menu.classList.add('invisible');
        runLoadingSequence();
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
    })
}
//journal
function populateJournal() {
    let journal = document.getElementById("journal-contents");
    journal.innerHTML = '';
    let PageInstances = SequenceInstances.concat(StoryNodeInstances);
    for (let i = 0; i < visited.length; i++) {
        for (let j=0; j<PageInstances.length; j++) {
            if (PageInstances[j].title === visited[i]) {
                if (PageInstances[j].constructor === Sequence) {
                    for (let k = 0; k < PageInstances[j]._pages.length; k++) {
                        journal.appendChild(document.createElement('p')).id = PageInstances[j].title + [k];
                        let a = document.getElementById(PageInstances[j].title + [k]);
                        a.innerHTML = PageInstances[j].getPage(k)[0];
                    }
                } else if (PageInstances[j].constructor === StoryNode) {
                    journal.appendChild(document.createElement('p')).id = PageInstances[j].title + '0';
                        let a = document.getElementById(PageInstances[j].title + '0');
                        a.innerHTML = PageInstances[j]._text;
                }
            }
        }
    }
}
function setupJournalButtons() {
    let tableOfContents = ['intro','ante','castRunes','enterProper','Fleeing','BridgeWall','Watching','ApproachWall','Lines','Pressing','BridgeGarden','Garden','Approach','Wands','Ignoring','dyingLight','corpses','darkWindow','mothNode','darkApproachTree','Falling','darkNoises','darkContemplation','crow','pit','Lights','scorn','alone','fungus','fungusCistern','enterCistern','echoesCistern','Blades','Apathy','Cowardice','Doubt','failApathy','failCowardice','failDoubt','drowningCistern','freeCistern','tools','swimCaveCistern','enterCave','Waiting','Altar','egress']
    for (let i = 0; i < tableOfContents.length; i++) {
        let b = document.getElementById('contents-button-' + tableOfContents[i]);
        let journal_entry = document.getElementById(tableOfContents[i] + '0');
        if (journal_entry === null) {
            b.classList.add('invisible');
        } else {
            b.classList.remove('invisible');
            b.addEventListener('click',()=>{
                document.getElementById(tableOfContents[i] + '0').scrollIntoView();
                clearFocus();
            })
        }
    }
}
document.getElementById('journal-close').addEventListener('click',()=>{
    document.getElementById('content').classList.remove('invisible')
    document.getElementById('journal-overlay').classList.add('invisible')
})
//
//cursor and parallax
//
let backgroundFront = document.getElementById('background-parallax-front')
let backgroundBack = document.getElementById('background-parallax-back')
let main_nav = document.getElementById('main-nav')
let ww = window.innerWidth;
let wh = window.innerHeight;
let mainMenuOpen = true;
let ingameMenuOpen = false;

backgroundFront.style.left = `${(ww * 0.30) + 1}px`
backgroundFront.style.top = `${+1}px`
backgroundBack.style.left = `${(ww * 0.30) - 1}px`
backgroundBack.style.top = `${-1}px`
main_nav.style.left = `${(ww * 0.30) + 1 + (wh*0.60) - 310}px`

let cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e)=>{
    cursor.style.top = `${e.pageY}px`;
    cursor.style.left = `${e.pageX}px`;
    if (mainMenuOpen === true) {
        ww = window.innerWidth;
        wh = window.innerHeight;
        let x = e.pageX - (ww/2)
        let y = e.pageY - (wh/2)
        x = x/(ww/15)
        y = y/(wh/15)
        backgroundFront.style.left = `${(ww * 0.30) + x}px`
        backgroundFront.style.top = `${+y}px`
        backgroundBack.style.left = `${(ww * 0.30) - x}px`
        backgroundBack.style.top = `${-y}px`
        main_nav.style.left = `${(ww * 0.30) + x + (wh*0.60) - 310}px`
    }
  });
//
//main menu
//
let main_menu = document.getElementById('main-menu-overlay');
let loading_overlay = document.getElementById('loading-overlay')
let hasSavedData = false;
document.getElementById('enter-button').addEventListener('click',()=>{
    if (hasSavedData === false) {
        loadPage(intro,0);
        runLoadingSequence();
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
    } else if (hasSavedData === true) {
        sendLoadPopup();
    }
})
document.getElementById('map-button').addEventListener('click',()=>{
    showOverlay('map')
})
document.getElementById('options-button').addEventListener('click',()=>{
    showOverlay('options')
})
document.getElementById('credits-button').addEventListener('click',()=>{
    showOverlay('credits')
})
document.getElementById('main-quit-button').addEventListener('click',()=>{
    ipcRenderer.send('quitGame');
})
//
//in game menu
//
let ingame_menu = document.getElementById('ingame-menu-overlay');
document.addEventListener('keydown',(k)=>{
    if (k.code === 'Escape') {
        if (ingameMenuOpen) {
            ingame_menu.classList.add('invisible')
            ingameMenuOpen = false;
        } else if (!ingameMenuOpen) {
            ingame_menu.classList.remove('invisible')
            ingameMenuOpen = true;
        }
    }
})
//ingame continue
document.getElementById('button-housing-10').addEventListener('mouseup',()=>{
    ingame_menu.classList.add('invisible')
    ingameMenuOpen = false;
})
//journal
document.getElementById('button-housing-11').addEventListener('mouseup',()=>{
    populateJournal();
    setupJournalButtons();
    document.getElementById('content').classList.add('invisible')
    document.getElementById('journal-overlay').classList.remove('invisible');
});
//options
document.getElementById('button-housing-12').addEventListener('mouseup',()=>{
    showOverlay('options')
})
//ingame quit
document.getElementById('button-housing-13').addEventListener('mouseup',()=>{
    ingame_menu.classList.add('invisible')
    main_menu.classList.remove('invisible')
    mainMenuOpen = true;
    ingameMenuOpen = false;
})


function runLoadingSequence() {
    loading_overlay.classList.remove('invisible');
}
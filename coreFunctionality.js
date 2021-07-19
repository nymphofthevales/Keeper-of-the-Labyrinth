//
//For anything that prints to the document, 
//and their pre-requisite functions for preparing 
//data to be printed.
//
'use strict'

const electron = require('electron');
const path = require('path')
const fs = require('fs')
const {ipcRenderer} = require('electron');

let hasSavedData = false;
let overlayOpen = false;
let mainMenuOpen = true;
let ingameMenuOpen = false;
let savedPageInstance = intro;
let page = 0;

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

function generateButton(number,text) {
    return `<div class=\"button-housing\" id=\"button-housing-${number}\"><div class=\"left-button-frame\" id=\"button-${number}-left\"></div><button id=\"button-${number}-middle\" class=\"middle-button-frame\"><p id=\"button-text-${number}\">${text}</p></button><div class=\"right-button-frame\" id=\"button-${number}-right\"></div></div>`
}
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
function manageImage(action,url,location) {
    let frame;
    if (action === 'print') {
        let img = document.createElement('img');
        if (location === undefined || location === 'positive') {
            frame = document.getElementById('image-positive');
            frame.appendChild(img).id = 'currentPosImg';
            let currentImage = document.getElementById('currentPosImg');
            currentImage.src = url;
            frame.style.top = `-35vh`;
            console.log(`${frame.offsetHeight/2}px`)
            //in future, perhaps use `${frame.offsetHeight/2}px` but for now, seems to run before the image has rendered, so offsetHeight returns 0 and the process fails. 30vh is a fine approximation for most images. if images were preloaded then might be able to return to using this.
        } else if (location === 'negative') {
            frame = document.getElementById('image-negative')
            frame.appendChild(img).id = 'currentNegImg';
            let currentImage = document.getElementById('currentNegImg');
            currentImage.src = url;
            frame.style.top = `35vh`
        }
    } else if (action === 'remove') {
        document.getElementById('image-negative').innerHTML = '';
        document.getElementById('image-positive').innerHTML = '';
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
            savedPageInstance = PageInstances[i];
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
function sendPopup(type,content,current,backUpAble) {
    let popup = document.getElementById('popup-menu');
    let loadFrame = document.getElementById('load-popup')
    let warningFrame = document.getElementById('warning-popup')
    loadFrame.classList.add('invisible');
    warningFrame.classList.add('invisible')
    if (type === 'load') {
        document.getElementById('popup-yes').addEventListener('click',()=>{
            loadPage(savedPageInstance,page);
            popup.classList.add('invisible');
            //runLoadingSequence();
            document.getElementById('main-menu-overlay').classList.add('invisible');
            mainMenuOpen = false;
            manageOverlays('hide','all')
        })
        document.getElementById('popup-no').addEventListener('click',()=>{
            loadPage(intro,0);
            visited = ['intro'];
            popup.classList.add('invisible');
            //runLoadingSequence();
            document.getElementById('main-menu-overlay').classList.add('invisible');
            mainMenuOpen = false;
            manageOverlays('hide','all')
        })
        loadFrame.classList.remove('invisible')
        popup.classList.remove('invisible');
    } else if (type === 'warning') {
        if (options.enableContentWarnings = true) {
            let warningsList = document.getElementById('warnings-list');
            warningsList.innerHTML = '';
            for (let i=0; i<content.length; i++) {
                warningsList.innerHTML += `<li>${content[i]}</li>`
            }
            let back = document.getElementById('warning-back')
            if (backUpAble === true) {
                back.classList.remove('invisible')
                back.addEventListener('click',()=>{
                    for (let i = 1; i <=visited.length; i++) {
                        for (let j=1; j<=StoryNodeInstances.length; j++) {
                            if (StoryNodeInstances[StoryNodeInstances.length-j].title === visited[visited.length-i]) {
                                    for (let i=0; i<visited.length ; i++) {
                                        if (visited[i] === current.title) {
                                            visited.splice(i,1);
                                        }
                                    }
                                    loadPage(StoryNodeInstances[StoryNodeInstances.length-j],0)
                            }
                        }
                    }
                    mainMusic.fadeOut(3);
                    popup.classList.add('invisible');
                })
            } else if (backUpAble === false) {
                back.classList.add('invisible');
            }
            document.getElementById('warning-skip').addEventListener('click',()=>{
                loadPage(current.getNext(),0)
                popup.classList.add('invisible');
            })
            document.getElementById('warning-show').addEventListener('click',()=>{
                popup.classList.add('invisible');
            })
            warningFrame.classList.remove('invisible');
            popup.classList.remove('invisible');
        } else {
            console.log('content warnings not enabled; not sent')
        }
    }
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
//
//cursor and parallax
//
let backgroundFront = document.getElementById('background-parallax-front')
let backgroundBack = document.getElementById('background-parallax-back')
let main_nav = document.getElementById('main-nav')
let ww = window.innerWidth;
let wh = window.innerHeight;

backgroundFront.style.left = `${(ww * 0.30) + 1}px`
backgroundFront.style.top = `${+1}px`
backgroundBack.style.left = `${(ww * 0.30) - 1}px`
backgroundBack.style.top = `${-1}px`
main_nav.style.left = `${(ww * 0.30) + 1 + (wh*0.60) - 310}px`

let cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e)=>{
    cursor.style.top = `${e.pageY}px`;
    cursor.style.left = `${e.pageX}px`;
    if (mainMenuOpen === true && options.enableParallax === true) {
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
    if (mainMenuOpen === false && options.enableParallax === true) {
        ww = window.innerWidth;
        wh = window.innerHeight;
        let x = e.pageX - (ww/2)
        let y = e.pageY - (wh/2)
        x = x/(ww/15)
        y = y/(wh/15)
        let pos = document.getElementById('image-positive');
        let neg = document.getElementById('image-negative');
        pos.style.left = `${x}px`
        neg.style.left = `${-x}px`
        pos.style.top = `${y-(pos.offsetHeight/2)}px`
        neg.style.top = `${-y+(neg.offsetHeight/2)}px`
    } else if (options.enableParallax === false) {
        let pos = document.getElementById('image-positive');
        let neg = document.getElementById('image-negative');
        pos.style.top = `${-(pos.offsetHeight/2)}px`
        neg.style.top = `${+(neg.offsetHeight/2)}px`
    }
  });
//
//main menu
//
let main_menu = document.getElementById('main-menu-overlay');
let loading_overlay = document.getElementById('loading-overlay')
document.getElementById('enter-button').addEventListener('click',()=>{
    if (hasSavedData === false) {
        loadPage(intro,0);
        showOverlay('loading')
        visited = ['intro'];
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
    } else if (hasSavedData === true) {
        sendPopup('load');
    }
    ingame_menu.classList.add('invisible')
    ingameMenuOpen = false;
})
document.getElementById('map-button').addEventListener('click',()=>{
    manageOverlays('show','map')
})
document.getElementById('options-button').addEventListener('click',()=>{
    manageOverlays('show','options')
})
document.getElementById('gallery-button').addEventListener('click',()=>{
    populateGallery(mainGallery);
    manageOverlays('show','gallery');
    setGalleryListeners();
})
document.getElementById('credits-button').addEventListener('click',()=>{
    manageOverlays('show','credits')
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
        if (overlayOpen === true) {
            manageOverlays('hide','all')
        } else if (overlayOpen === false) {
            if (ingameMenuOpen) {
                ingame_menu.classList.add('invisible')
                ingameMenuOpen = false;
            } else if (!ingameMenuOpen) {
                ingame_menu.classList.remove('invisible')
                ingameMenuOpen = true;
            }
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
    manageOverlays('show','journal')
});
//options
document.getElementById('button-housing-12').addEventListener('mouseup',()=>{
    manageOverlays('show','options')
})
//ingame quit
document.getElementById('button-housing-13').addEventListener('mouseup',()=>{
    ingame_menu.classList.add('invisible')
    main_menu.classList.remove('invisible')
    mainMenuOpen = true;
    ingameMenuOpen = false;
})

let overlay_close_array = document.querySelectorAll('.overlay-close');
for (let i=0; i<overlay_close_array.length; i++) {
    if (overlay_close_array.length !==0) {
        overlay_close_array[i].addEventListener('click',()=>{
            manageOverlays('hide','all')
        })
    }
}
function manageOverlays(action,overlay) {
    let overlaysList = ['options','credits','map','journal','loading','font-license','font-license-2','gallery','gallery-inspector']
    clearFocus();
    if (action === 'show') {
        overlayOpen = true;
        document.getElementById('content').classList.add('invisible')
        for (let i = 0; i<overlaysList.length; i++) {
            let identifier = `${overlaysList[i]}-overlay`
            let reference = document.getElementById(identifier);
            if (overlaysList[i] !== overlay) {
                reference.classList.add('invisible');
            } else if (overlaysList[i] === overlay) {
                reference.classList.remove('invisible');
            }
        }
    } else if (action === "hide") {
        overlayOpen = false;
        document.getElementById('content').classList.remove('invisible')
        for (let i = 0; i<overlaysList.length; i++) {
            let identifier = `${overlaysList[i]}-overlay`
            let reference = document.getElementById(identifier);
            reference.classList.add('invisible');
        }
    }
}

function runLoadingSequence() {
    manageOverlays('show','loading');
    setTimeout(()=>{manageOverlays('hide','all')},4500)
}

document.getElementById('license-button').addEventListener('click',()=>{
    manageOverlays('show','font-license')
})
document.getElementById('license-button-2').addEventListener('click',()=>{
    manageOverlays('show','font-license-2')
})

//manage options
function manageTextOptions() {
    let textStylesheets = [
        document.getElementById('small-style'),
        document.getElementById('default-style'),
        document.getElementById('medium-style'),
        document.getElementById('large-style')
    ]
    let textOptions = [
        document.getElementById('small-text'),
        document.getElementById('default-text'),
        document.getElementById('medium-text'),
        document.getElementById('large-text'),
    ]
    for (let a=0; a<textStylesheets.length; a++) {
        if (textOptions[a].checked !== true) {
            textStylesheets[a].disabled = true;
        } else if (textOptions[a].checked === true) {
            textStylesheets[a].disabled = false;
        }
    }
}
document.getElementById(`small-text`).addEventListener('change',()=>{
    manageTextOptions();
})
document.getElementById(`default-text`).addEventListener('change',()=>{
    manageTextOptions();
})
document.getElementById(`medium-text`).addEventListener('change',()=>{
    manageTextOptions();
})
document.getElementById(`large-text`).addEventListener('change',()=>{
    manageTextOptions();
})


document.getElementById(`music-off`).addEventListener('mouseup',()=>{
    mainMusic._currentSong.pause();
    options['enableMusic'] = false;
})
document.getElementById(`music-on`).addEventListener('mouseup',()=>{
    if (mainMusic.currentlyPlaying === true) {
        mainMusic._currentSong.play();
    }
    options['enableMusic'] = true;
})
let volumeInput = document.getElementById('volume-slider')
volumeInput.addEventListener('mouseup',()=>{
    options.volume = volumeInput.value;
    mainMusic._maxVolume = (2*options.volume)/100;
    mainMusic._currentSong.volume = (2*options.volume)/100;
})
document.getElementById(`warnings-off`).addEventListener('mouseup',()=>{
    options['enableWarnings'] = false;
})
document.getElementById(`warnings-on`).addEventListener('mouseup',()=>{
    options['enableWarnings'] = true;
})

document.getElementById(`parallax-off`).addEventListener('mouseup',()=>{
    options['enableParallax'] = false;
})
document.getElementById(`parallax-on`).addEventListener('mouseup',()=>{
    options['enableParallax'] = true;
})
//document.getElementById('submit-options').addEventListener('click',setOptions)

function populateGallery(gallery) {
    let frame = document.getElementById('gallery-frame');
    frame.innerHTML = '';
    for (let i=0; i<gallery.elements.length; i++) {
        frame.innerHTML += gallery.generatePreviewHTML(i);
    }
}

function setGalleryListeners() {
    let previews = document.querySelectorAll(".gallery-image-preview");
    for (let i = 0; i< previews.length; i++) {
        document.getElementById(`gallery-${i}-button`).addEventListener('mouseup',()=>{
            document.getElementById('gallery-inspector-frame').innerHTML = mainGallery.generateInspectorHTML(i);
            manageOverlays('show','gallery-inspector');
            setGalleryBackButton();
        })
    }
}

function setGalleryBackButton() {
    document.getElementById('gallery-back-button').addEventListener('click',()=>{
        populateGallery(mainGallery);
        manageOverlays('show','gallery');
        setGalleryListeners();
    })
}

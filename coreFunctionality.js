'use strict'

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
let images = [];
function preloadImages() {
    for (let i=0; i < imageUrls.length; i++) {
        let img = document.createElement('img')
        document.getElementById('image-positive').appendChild(img).id="currentPosImg";
        document.getElementById('currentPosImg').src = imageUrls[i]
        document.getElementById('currentPosImg').id += i;
        console.log(document.getElementById('image-positive').innerHTML)
    }
    document.getElementById('image-positive').innerHTML = '';
}
function manageImage(action,url,location) {
    let frame;
    if (action === 'print') {
        let img = document.createElement('img');
        if (location === undefined || location === 'positive') {
            frame = document.getElementById('image-positive');
            frame.appendChild(img).id = 'currentPosImg';
            let currentImage = document.getElementById('currentPosImg');
            currentImage.src = url;
            if (currentImage.offsetHeight > 0) {
                frame.style.top = `-${currentImage.offsetHeight/2}px`;
            } else {
                frame.style.top = `-35vh`;
            }
        } else if (location === 'negative') {
            frame = document.getElementById('image-negative')
            frame.appendChild(img).id = 'currentNegImg';
            let currentImage = document.getElementById('currentNegImg');
            currentImage.src = url;
            if (frame.offsetHeight > 0) {
                frame.style.top = `${frame.offsetHeight/2}px`;
            } else {
                frame.style.top = `35vh`;
            }
        }
    } else if (action === 'remove') {
        document.getElementById('image-negative').innerHTML = '';
        document.getElementById('image-positive').innerHTML = '';
    }
};
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
            manageImage('remove','all','');
            checkSpecialActions(current);
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
function redirect(time,current) {
    console.log(`redirecting to next page in ${time/1000} seconds`)
    setTimeout(()=>{progression(current)},time)
}
function loadPage(current,page_number) {
    genActions(current);
    page = page_number
    print(current.getPage(page_number),current);
    console.log(`${current.title} ${page} was loaded`);
};
//^ page printing and progression
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v story and ingame menu buttons
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
//^ story and ingame menu buttons
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v popup menus
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
//^ popup menus
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v cursor and parallax
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
//^ cursor and parallax
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v main menu
let main_menu = document.getElementById('main-menu-overlay');
let loading_overlay = document.getElementById('loading-overlay')
document.getElementById('enter-button').addEventListener('click',()=>{
    preloadImages();
    if (hasSavedData === false) {
        loadPage(intro,0);
        visited = ['intro'];
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
    } else if (hasSavedData === true) {
        sendPopup('load');
    }
    ingame_menu.classList.add('invisible')
    ingameMenuOpen = false;
})
document.getElementById('options-button').addEventListener('click',()=>{
    manageOverlays('show','options')
})
document.getElementById('credits-button').addEventListener('click',()=>{
    manageOverlays('show','credits')
})
document.getElementById('main-quit-button').addEventListener('click',()=>{
    ipcRenderer.send('quitGame');
})
//^ main menu
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v ingame menu
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
//ingame options
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
//^ ingame menu
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v overlay management
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
        ipcRenderer.send('adjustOptions',options);
        document.getElementById('content').classList.remove('invisible')
        for (let i = 0; i<overlaysList.length; i++) {
            let identifier = `${overlaysList[i]}-overlay`
            let reference = document.getElementById(identifier);
            reference.classList.add('invisible');
        }
    }
}
//^ overlay management
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v specific overlay functionality
//v loading
function runLoadingSequence() {
    manageOverlays('show','loading');
    setTimeout(()=>{manageOverlays('hide','all')},4500)
}
//^ loading
//v credits
document.getElementById('license-button').addEventListener('click',()=>{
    manageOverlays('show','font-license')
})
document.getElementById('license-button-2').addEventListener('click',()=>{
    manageOverlays('show','font-license-2')
})
//^ credits
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v options
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
            switch (textOptions[a].id) {
                case 'small-text': options.textSize = "small"
                    break;
                case 'default-text': options.textSize = "default"
                    break;
                case 'medium-text': options.textSize = "medium"
                    break;
                case 'large-text': options.textSize = "large"
                    break;
            }
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
function setOptionsForm() {
    let warningsOff = document.getElementById(`warnings-off`)
    let warningsOn = document.getElementById(`warnings-on`)
    let musicOff = document.getElementById(`music-off`)
    let musicOn = document.getElementById(`music-on`)
    let parallaxOff = document.getElementById(`parallax-off`)
    let parallaxOn = document.getElementById(`parallax-on`)
    if (options.enableMusic === true) {
        musicOff.checked = false;
        musicOn.checked = true;
    } else {
        musicOff.checked = true;
        musicOn.checked = false;
    }
    if (options.enableWarnings === true) {
        warningsOff.checked = false;
        warningsOn.checked = true;
    } else {
        warningsOff.checked = true;
        warningsOn.checked = false;
    }
    if (options.enableParallax === true) {
        parallaxOff.checked = false;
        parallaxOn.checked = true;
    } else {
        parallaxOff.checked = true;
        parallaxOn.checked = false;
    }
    document.getElementById(`${options.textSize}-text`).checked = true;
    volumeInput.value = options.volume;
}
//^ options
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v journal
document.getElementById('button-housing-11').addEventListener('mouseup',()=>{
    populateJournal();
    setupJournalButtons();
    manageOverlays('show','journal')
});
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
//^ journal
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v gallery
document.getElementById('gallery-button').addEventListener('click',()=>{
    manageGalleryUnlocks();
    populateGallery(mainGallery);
    manageOverlays('show','gallery');
    setGalleryListeners();
})
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
function manageGalleryUnlocks() {
    getMasterSave();
    let actions = sumOfActions(masterSave);
    console.log(actions);
    for (let i = 0; i < actions.length; i++) {
        switch (actions[i]) {
            case 'intro': 
                mainGallery.unlock('The Labyrinth Gate')
                console.log('unlocking gate')
                break;
            case 'finishCandleAnte': 
                mainGallery.unlock('An Anchor')
                break;
            case 'obelisk': 
                mainGallery.unlock('The Obelisk')
                break;
            case 'readRunes': 
                mainGallery.unlock('Ritual of Runes');
                mainGallery.unlock('The Runes')
                break;
            case 'Lines': 
                mainGallery.unlock('Ritual of Lines')
                mainGallery.unlock('The Chalk')
                break;
            case 'Rowan': 
                mainGallery.unlock('The Rowan')
                break;
            case 'Wands': 
                mainGallery.unlock('Ritual of Wands')
                mainGallery.unlock('The Wand')
                break;
            case 'windowPlaceCandle': 
                mainGallery.unlock('An Anchor')
                break;
            case 'mothLands': 
                mainGallery.unlock('The Moth')
                break;
            case 'crow': 
                mainGallery.unlock('The Crow')
                break;
            case 'Lights': 
                mainGallery.unlock('Ritual of Lights')
                mainGallery.unlock('The Candles')
                break;
            case 'Blades': 
                mainGallery.unlock('Ritual of Blades')
                mainGallery.unlock('The Knife')
                break;
            case 'drowningCistern': 
                mainGallery.unlock('Drowning')
                break;
            case 'Waiting': 
                mainGallery.unlock('The Watching Masks')
                break;
        }
    }
}
//^ gallery
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v map
document.getElementById('map-button').addEventListener('click',()=>{
    placeMapSaveButtons();
    manageOverlays('show','map')
})
function mapSaveButton(date,timestamp) {
    return `<button class=\"map-save-button\" id=\"map-save-${timestamp}\"><div id=\"map-save-${timestamp}-grid\"><h3>${date}</h3></div></button>`
}
function placeMapSaveButtons() {
    getMasterSave();
    let saves = sortSaveObject(masterSave);
    let d = Object.keys(saves);
    console.log(d)
    let dates = [];
    let buttons = [];
    let nav = document.getElementById('map-saves-list');
    for (let i=0; i < d.length; i++) {
        let s = d[i].split('/');
        let date = `${s[0]}/${s[1]}/${s[2]}`;
        date = dateStampToWords(date);
        let timestamp = parseInt(s[3]);
        dates.push([d[i],date,timestamp])
    }
    dates = dates.sort(function(a, b){return b[2]-a[2]});
    nav.innerHTML = '';
    nav.innerHTML += `<button class=\"map-save-button\" id=\"map-save-all\"><div id=\"map-save-all-grid\"><h3>View All</h3></div></button>`
    for (let i=0; i < dates.length; i++) {
        nav.innerHTML += mapSaveButton(dates[i][1],dates[i][2])
        buttons.push([`map-save-${dates[i][2]}`,dates[i][0]]);
    }
    console.log(buttons);
    for (let i=0; i<buttons.length; i++) {
        buttons[i][0] = document.getElementById(`${buttons[i][0]}`)
        buttons[i][0].addEventListener('click',()=>{
            printMap(saves[`${buttons[i][1]}`]);
            selectMapButton(buttons,i);
        })
    }
    return buttons;
}

function printMap(saveObject) {
    console.log(['printing',saveObject])
}
function selectMapButton(buttonArray,refNumber) {
    for (let i=0; i<buttonArray.length; i++) {
        let node = buttonArray[i][0]
        if (i === refNumber) {
            //node.style.backgroundImage = "./assets/ui/map-button-selected.png";
            node.style.border = "2px dashed red";
        } else {
            //node.style.backgroundImage = "./assets/ui/map-button-unselected.png"
            node.style.border = "none"
        }
    }
}
let menuShown = true;
function manageSavesMenu() {
    let nav = document.getElementById('map-saves-frame');
    if (menuShown === false) {
        menuShown = true;
        nav.classList.remove('hidden');
        nav.classList.remove('closed');
        nav.classList.add('shown');
        clearFocus();
        for (let i=0; i<navButtons.length; i++) {
            navButtons[i].tabIndex = i+2;
        }
    } else if (menuShown === true) {
        menuShown = false;
        nav.classList.remove('shown')
        nav.classList.add('closed');
        setTimeout(()=>{nav.classList.add('hidden')},500)
        clearFocus();
        for (let i=0; i<navButtons.length; i++) {
            navButtons[i].tabIndex = -1;
        }
    };
};
//^ map
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
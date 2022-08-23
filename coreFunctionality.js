'use strict'

function generateButton(number,text) {
    return `<div class=\"button-housing\" id=\"button-housing-${number}\"><div class=\"left-button-frame\" id=\"button-${number}-left\"></div><button id=\"button-${number}-middle\" class=\"middle-button-frame\"><p id=\"button-text-${number}\">${text}</p></button><div class=\"right-button-frame\" id=\"button-${number}-right\"></div></div>`
}
function print(data,current) {
    if (options.enableTextFade === true) {
        setTimeout(()=>{
            let content = document.getElementById('story-frame')
            content.style.animation = '0.5s fade-in'
            doPrinting();
        },200)
    } else {
        doPrinting();
    }
    function doPrinting() {
        document.getElementById('story-frame').style.opacity = '1.0';
        //data takes form of [page text string, button string or array] as returned by StoryNode or Sequence .getPage()
        //Sequence.getPage() returns a string, StoryNode an array.
        let textHouse = document.getElementById("text");
        let btnHouse = document.getElementById("buttons");
        textHouse.innerHTML = '';
        btnHouse.innerHTML = '';
        let p = () =>  document.createElement("p");
        let text = data[0];
        textHouse.appendChild(p()).id="currentText";
        let currentText = document.getElementById("currentText");
        currentText.innerHTML = text;
        if (typeof data[1] === 'string') {
            //for printing pages from a sequence
            let buttonText = data[1];
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
    }
};
function genActions(current) {
    clearFocus();
    printStoryImages(current);
    checkSpecialActions(current);
}
function progression(current,destination_button_number) {
    if (options.enableTextFade === true) {
        document.getElementById('story-frame').style.animation = '0.2s fade-out'
        setTimeout(()=>{
            document.getElementById('story-frame').style.opacity = '0.0';
            doProgression();
        },200)
    } else {
        doProgression();
    }
    function doProgression() {
        if (current.constructor.name === 'Sequence') {
            if (page >= current.getLength()-1) {
                page = 0;
                current = current.getNext();
                visit(current);
                genActions(current);
                print(current.getPage(page),current);
                console.log(`progressed to ${current.title} (${current.constructor.name})`)
            } else if (page <= current.getLength()) {
                page += 1;
                genActions(current);
                print(current.getPage(page),current)
                console.log(`progressed to ${current.title} ${page}`)
            }
        } else if (current.constructor.name === 'StoryNode') {
            let destination = current.getDestinations()[destination_button_number];
            current = destination;
            visit(current);
            genActions(current);
            print(current.getPage(0),current)
            console.log(`progressed to ${current.title} (${current.constructor.name})`)
        }
    }
}
function redirect(time,current) {
    document.getElementById('buttons').style.visibility = 'hidden';
    console.log(`redirecting to next page in ${time/1000} seconds`)
    setTimeout(()=>{
        progression(current)
        document.getElementById('buttons').style.visibility = 'visible'
    },time)
}
function loadPage(current,page_number) {
    page = page_number
    visit(current);
    genActions(current);
    print(current.getPage(page_number),current);
    console.log(`${current.title} ${page} was loaded`);
};
//^ page printing and progression
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v story and ingame menu buttons
function listen(buttonArray,current) {
    window.onbeforeunload = () => {
        saveParameters(current)
        return undefined
    }
    document.getElementById('button-housing-13').removeEventListener('click',()=>{saveParameters(current)},true)
    document.getElementById('button-housing-13').addEventListener('click',()=>{saveParameters(current)},true)
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
    getSaveData();
    function loadSavedActions() {
        loadPage(savedPageInstance,page);
        popup.classList.add('invisible');
        //runLoadingSequence();
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
        manageOverlays('hide','all')
    }
    function loadIntroActions() {
        loadPage(intro,0);
        visited = ['intro'];
        popup.classList.add('invisible');
        //runLoadingSequence();
        document.getElementById('main-menu-overlay').classList.add('invisible');
        mainMenuOpen = false;
        manageOverlays('hide','all')
    }
    if (type === 'load') {
        document.getElementById('popup-yes').removeEventListener('click',()=>{loadSavedActions()})
        document.getElementById('popup-yes').addEventListener('click',()=>{loadSavedActions()})
        document.getElementById('popup-no').removeEventListener('click',()=>{loadIntroActions()})
        document.getElementById('popup-no').addEventListener('click',()=>{loadIntroActions()})
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
            console.log('content warnings disabled; not sent')
        }
    }
}
//^ popup menus
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v image system
let images = [];
function preloadImages() {
    for (let i=0; i < imageUrls.length; i++) {
        let img = document.createElement('img')
        document.getElementById('image-positive').appendChild(img).id="currentPosImg";
        document.getElementById('currentPosImg').src = imageUrls[i]
        document.getElementById('currentPosImg').id += i;
        //console.log(document.getElementById('image-positive').innerHTML)
    }
    document.getElementById('image-positive').innerHTML = '';
}
function manageImage(action,url,location) {
    let frame;
    let imgId;
    let div = () => document.createElement('div')
    let img = () => document.createElement('img')
    switch (location) {
        case 'negative': imgId = 'currentNegImg'
            break;
        case 'positive': imgId = 'currentPosImg'
            break;
    }
    if (action === 'print') {
        if (document.getElementById('image-frame') === null) {
            document.getElementById('content').appendChild(div()).id = "image-frame";
        }
        if (document.getElementById(imgId) === null) {
            doImagePrinting()
        } else {
            let urlFilename = url.split('/');
            urlFilename = urlFilename[urlFilename.length - 1]
            let pageFilename = document.getElementById(imgId).src.split('/')
            pageFilename = pageFilename[pageFilename.length - 1]
            if (pageFilename !== urlFilename) {
                doImagePrinting()
            } else {
                console.log('image already printed')
            }
        }
    } else if (action === 'clear') {
        if (document.getElementById('image-frame') !== null) {
            document.getElementById('image-frame').remove();
        }
    }
    function doImagePrinting() {
        if (location === undefined || location === 'positive') {
            document.getElementById('image-frame').appendChild(img()).id = 'currentPosImg';
            let currentImage = document.getElementById('currentPosImg');
            currentImage.src = url;
        } else if (location === 'negative') {
            document.getElementById('image-frame').appendChild(img()).id = 'currentNegImg';
            let currentImage = document.getElementById('currentNegImg');
            currentImage.src = url;
        }
    }
};
//^ image system
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
        if (document.getElementById('currentPosImg') !== null && document.getElementById('currentNegImg') !== null) {
            let pos = document.getElementById('currentPosImg');
            let neg = document.getElementById('currentNegImg');
            pos.style.left = `calc(${x}px + 50%)`
            neg.style.left = `calc(${-x}px - 50%)`
            pos.style.top = `${y}px`
            neg.style.top = `${-y}px`
        }
    }
  });
//^ cursor and parallax
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v main menu
let main_menu = document.getElementById('main-menu-overlay');
let loading_overlay = document.getElementById('loading-overlay')
document.getElementById('enter-button').addEventListener('click',()=>{
    //preloadImages();
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
let ingame_menu_button = document.getElementById('ingame-menu-button');
ingame_menu_button.addEventListener('mouseup',()=>{

})
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

function manageIngameMenu() {
    
}
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
    getMasterSave()
    sortSaveObject(masterSave)
    mainMusic.fadeOut(1)
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
    clearFocus();
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
document.getElementById(`text-fade-off`).addEventListener('mouseup',()=>{
    options['enableTextFade'] = false;
})
document.getElementById(`text-fade-on`).addEventListener('mouseup',()=>{
    options['enableTextFade'] = true;
})
function setOptionsForm() {
    let warningsOff = document.getElementById(`warnings-off`)
    let warningsOn = document.getElementById(`warnings-on`)
    let musicOff = document.getElementById(`music-off`)
    let musicOn = document.getElementById(`music-on`)
    let parallaxOff = document.getElementById(`parallax-off`)
    let parallaxOn = document.getElementById(`parallax-on`)
    let textFadeOff = document.getElementById(`text-fade-off`)
    let textFadeOn = document.getElementById(`text-fade-on`)
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
    if (options.enableTextFade === true) {
        textFadeOff.checked = false;
        textFadeOn.checked = true;
    } else {
        textFadeOff.checked = true;
        textFadeOn.checked = false;
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
    let tableOfContents = ['intro','ante','castRunes','enterProper','Fleeing','BridgeWall','Watching','ApproachWall','Lines','Pressing','BridgeGarden','Garden','Approach','Wands','Stranger','dyingLight','corpses','darkWindow','mothNode','darkApproachTree','Falling','darkNoises','darkContemplation','crow','pit','Lights','scorn','alone','fungus','fungusCistern','enterCistern','echoesCistern','Blades','Apathy','Cowardice','Doubt','failApathy','failCowardice','failDoubt','drowningCistern','freeCistern','tools','swimCaveCistern','enterCave','Waiting','Altar','egress']
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
    //console.log(actions);
    for (let i = 0; i < actions.length; i++) {
        switch (actions[i]) {
            case 'intro': 
                mainGallery.unlock('The Labyrinth Gate')
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
            case 'corpseContemplation': 
                mainGallery.unlock('The Dead')
                break;
            case 'Falling': 
                mainGallery.unlock('Falling')
                break;
            case 'beatRises': 
                mainGallery.unlock('The Pit')
                break;
            case 'Lights': 
                mainGallery.unlock('Ritual of Lights')
                mainGallery.unlock('The Candles')
                break;
            case 'echoesCistern': 
                mainGallery.unlock('The Cistern')
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
            case 'Altar': 
                mainGallery.unlock('The Altar')
                break;
            case 'Changing': 
                mainGallery.unlock('Her')
                break;
        }
    }
}

//^ gallery
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v map

let labyrinthMap = new Grid(0,0,"70px",mapPresets.antechamber)
function prepareMap(visitedArray) {
    centerMap()
    appendNodeTitles(labyrinthMap)
    setMapNodeListeners(visitedArray)
}
document.getElementById('map-button').addEventListener('click',()=>{
    getMasterSave();
    setTimeout(()=>{
        placeMapSaveButtons()
        manageOverlays('show','map')
        prepareMap()
    },100)
})
document.getElementById('map-zoom-in').addEventListener('click',()=>{
    let size = labyrinthMap.cellSize
    size = parseInt(size.slice(0,-2));
    if (size + 10 < window.innerHeight/5) {
        size += 10;
    }
    size = size + 'px'
    labyrinthMap = new Grid(0,0,size,labyrinthMap.getPreset())
    prepareMap()
})
document.getElementById('map-zoom-out').addEventListener('click',()=>{
    let size = labyrinthMap.cellSize
    size = parseInt(size.slice(0,-2));
    if (size - 10 > 0) {
        size -= 10;
    }
    size = size + 'px'
    labyrinthMap = new Grid(0,0,size,labyrinthMap.getPreset())
    prepareMap()
})
document.getElementById('map-toggle-saves').addEventListener('click',()=>{
    manageSavesMenu();
    clearFocus();
}) 
document.getElementById('node-inspector-close').addEventListener('click',()=>{
    document.getElementById('map-node-inspector-frame').classList.add('invisible')
})
let savesShown = false;
function manageSavesMenu() {
    let savesFrame = document.getElementById('map-saves-frame')
    if (savesShown === false) {
        savesFrame.classList.remove('invisible');
        savesShown = true;
        //console.log('saves shown')
    } else if (savesShown === true) {
        savesFrame.classList.add('invisible');
        savesShown = false;
        //console.log('saves hidden')
    }
}
function mapSaveButton(date,timestamp) {
    return `<button class=\"map-save-button\" id=\"map-save-${timestamp}\"><div id=\"map-save-${timestamp}-grid\"><h3>${date}</h3></div></button>`
}
function placeMapSaveButtons() {
    let saves = sortSaveObject(masterSave);
    let d = Object.keys(saves);
    //console.log(d)
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
    //console.log(buttons);
    for (let i=0; i<buttons.length; i++) {
        buttons[i][0] = document.getElementById(`${buttons[i][0]}`)
        buttons[i][0].addEventListener('click',()=>{
            printMap(saves[`${buttons[i][1]}`].visited);
            selectMapButton(buttons,i);
        })
    }
    document.getElementById('map-save-all').addEventListener('click',()=>{
        printMap(sumOfActions(sortSaveObject(masterSave)));
        document.getElementById('map-save-all').classList.add("selected-map-save");
        for (let i=0; i<buttons.length; i++) {
            buttons[i][0].classList.remove('selected-map-save')
        }
        manageSavesMenu();
    })
    return buttons;
}
function selectMapButton(buttonArray,refNumber) {
    for (let i=0; i<buttonArray.length; i++) {
        let node = buttonArray[i][0]
        if (i === refNumber) {
            node.classList.add("selected-map-save");
        } else {
            node.classList.remove("selected-map-save");
            document.getElementById('map-save-all').classList.remove("selected-map-save");
        }
    }
    manageSavesMenu();
}
function printMap(visitedArray) {
    //console.log(visitedArray)
    let nodes = labyrinthMap.getNodes();
    for (let i=0; i<nodes.length; i++) {
        let successes = [];
        for (let k=0; k<nodes[i].pageObjects.length; k++) {
            for (let j = 0; j<visitedArray.length; j++) {
                if (visitedArray[j] === nodes[i].pageObjects[k]) {
                    successes.push(true)
                    break
                } else {
                    successes.push(false)
                }
            }
        }
        console.log(successes)
        if (successes.includes(true) === true) {
            nodes[i].unlocked = true;
        } else {
            nodes[i].unlocked = false;
        }
    }
    labyrinthMap.printMapTiles()
    prepareMap(visitedArray)
}
function setMapNodeListeners(visitedArray) {
    let nodes = labyrinthMap.getNodes();
    for (let i=0; i<nodes.length; i++) {
        let DOMRef = labyrinthMap.getElementDOMNode(labyrinthMap.getIndexFromCoords(nodes[i].position))
        DOMRef.addEventListener('click',()=>{
            printNodeInspector(nodes[i],visitedArray);
        })
    }
}
function loadInFromMap(PageInstance,visitedArray) {
    for (let i=0; i<visitedArray.length; i++) {
        if (visitedArray[i] === PageInstance.title) {
            visited = visitedArray.slice(0,i+1)
        }
    }
    loadPage(PageInstance,0)
    //runLoadingSequence();
    document.getElementById('main-menu-overlay').classList.add('invisible');
    mainMenuOpen = false;
    manageOverlays('hide','all')
    document.getElementById('map-node-inspector-frame').classList.add('invisible')
}

function printNodeInspector(MapNodeObject,visitedArray) {
    let title = document.getElementById('node-inspector-title');
    let textContent = document.getElementById('node-inspector-text-content')
    let choices = document.getElementById('node-inspector-choices')
    let loadIn = document.getElementById('node-inspector-load-in')
    title.innerHTML = '';
    textContent.innerHTML = '';
    choices.innerHTML = '';
    if (MapNodeObject.unlocked === true) {
        loadIn.classList.remove('invisible')
        for (let i=0; i < MapNodeObject.pageObjects.length; i++) {
            for (let j=0; j<PageInstances.length; j++) {
                if (PageInstances[j].title === MapNodeObject.pageObjects[i]) {
                    loadIn.removeEventListener('click',()=>{loadInFromMap(PageInstances[j],visitedArray)})
                    loadIn.addEventListener('click',()=>{loadInFromMap(PageInstances[j],visitedArray)})
                    if (PageInstances[j].constructor === Sequence) {
                        for (let k = 0; k < PageInstances[j]._pages.length; k++) {
                            textContent.appendChild(document.createElement('p')).id = 'Map-Node-' + PageInstances[j].title + [k];
                            let a = document.getElementById('Map-Node-' + PageInstances[j].title + [k]);
                            a.innerHTML = PageInstances[j].getPage(k)[0];
                        }
                    } else if (PageInstances[j].constructor === StoryNode) {
                        textContent.appendChild(document.createElement('p')).id = 'Map-Node-' + PageInstances[j].title + '0';
                            let a = document.getElementById('Map-Node-' + PageInstances[j].title + '0');
                            a.innerHTML = PageInstances[j]._text;
                    }
                }
            }
        }
        title.innerText = MapNodeObject.title;
    } else if (MapNodeObject.unlocked === false) {
        title.innerText = '?'
        loadIn.classList.add('invisible');
        textContent.appendChild(document.createElement('p')).id = 'Map-Node-' + MapNodeObject.pageObject + 0;
        document.getElementById(`Map-Node-${MapNodeObject.pageObject}0`).innerHTML = "Explore the <span class=\"labyrinth-color\">labyrinth</span> to unlock this node."
    }
    document.getElementById('map-node-inspector-frame').classList.remove('invisible');
}
function centerMap() {
    let housing = document.getElementById('map-housing');
    housing.scrollTop = (housing.scrollHeight - housing.clientHeight)/2
    housing.scrollLeft = 0;
}
//^ map
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////





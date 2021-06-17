//
//For anything that prints to the document, 
//and their pre-requisite functions for preparing 
//data to be printed, including the save/load system.
//

'use strict'

function generateButton(number,text) {
    return `<div class=\"button-housing\" id=\"button-housing-${number}\"><div class=\"left-button-frame\" id=\"button-${number}-left\"></div><button id=\"button-${number}-middle\" class=\"middle-button-frame\"><p id=\"button-text-${number}\">${text}</p></button><div class=\"right-button-frame\" id=\"button-${number}-right\"></div></div>`
}

let page = 0;
window.onload = () => {readSaves()}

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
function listen(buttonArray,current) {
        window.onbeforeunload = () => {
            save(current,page);
            return undefined
        }
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

    for (let i=0; i<document.querySelectorAll('.button-housing').length; i++) {
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
}

function redirect(time,current) {
    console.log(`redirecting to next page in ${time/1000} seconds`)
    setTimeout(()=>{progression(current)},time)
}

function save(current,savedPage) {
    if (savedPage === undefined) {
        savedPage = 0;
    }
    let savedVisitedArray = "[]";
    if (visited.length > 0) {
        let jsonString = "["
        for (let i=0; i<visited.length; i++) {
            jsonString = jsonString + `\"${visited[i]}\"\,`;
        }
        savedVisitedArray = jsonString.slice(0,-1) + "]";
    }
    let savedLocation = Object.assign({},current);
    document.cookie = `save={"title":"${savedLocation.title}","page":${savedPage},"visited":${savedVisitedArray}}`
    console.log(document.cookie)
}
function readSaves() {
    let savedArray = document.cookie.split(';')
    for (let i=0; i<savedArray.length; i++) {
        if (savedArray[i].split('=')[0] === 'save') {
            let saveData = savedArray[i].split('=')[1];
            sendLoadPopup(saveData);
        } else {
            console.log("No save found.");
            loadPage(intro,0);
            break;
        }
    }
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
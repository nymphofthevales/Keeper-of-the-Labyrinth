//
//For anything that prints to the document, 
//and their pre-requisite functions for preparing 
//data to be printed, including the save/load system.
//

'use strict'

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
    let btn = () => document.createElement("button");
    let text = data[0];
    textHouse.appendChild(p()).id="currentText";
    let currentText = document.getElementById("currentText");
    currentText.innerHTML = text;
    if (typeof data[1] === 'string') {
        //for printing pages from a sequence
        let button = data[1];
        btnHouse.appendChild(btn()).id="sequenceBtn";
        let sequenceBtn = document.getElementById("sequenceBtn")
        sequenceBtn.innerHTML = button;
        sequenceBtn.tabIndex = '1'
        listen([sequenceBtn],current)
    } else { 
        //for printing a StoryNode. saves id references in btnRefs array for later use.
        let btnRefs = new Array();
        for (let i=0; i<data[1].length; i++) {
            let buttonTxt = data[1][i];
            btnHouse.appendChild(btn()).id=`button${i}`
            let ref = document.getElementById(`button${i}`)
            btnRefs.push(ref)
            ref.innerHTML = `${buttonTxt}`
            ref.tabIndex = `${i+6}`
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
        window.onbeforeunload = () =>{save(current,page)}
    if (current.constructor.name === 'Sequence') {
        let btn = buttonArray[0];
        btn.addEventListener('click',() => {
            progression(current);
        });
    } else if (current.constructor.name === 'StoryNode') {
        for (let i=0; i<buttonArray.length; i++) {
            buttonArray[i].addEventListener(
                'click',()=>{
                    progression(current,i)
                }
            )
        }
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
function sendLoadPopup(saveData) {
    let menu = document.getElementById('popup-menu');
    menu.classList.remove('invisible');
    let yes = document.getElementById('popup-yes');
    let no = document.getElementById('popup-no');
    yes.addEventListener('click',()=>{
        loadData(`${saveData}`)
        menu.classList.add('invisible');
    })
    no.addEventListener('click',()=>{
        loadPage(intro,0);
        menu.classList.add('invisible');
    })
}

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

document.getElementById('journal-open').addEventListener('click',()=>{
    populateJournal();
    setupJournalButtons();
    document.getElementById('content').classList.add('invisible')
    document.getElementById('journal-overlay').classList.remove('invisible');
});
document.getElementById('journal-close').addEventListener('click',()=>{
    document.getElementById('content').classList.remove('invisible')
    document.getElementById('journal-overlay').classList.add('invisible')
})

let cursor = document.getElementById('custom-cursor');
let body = document.querySelector('body');
body.addEventListener('mousemove', (e)=>{
    cursor.style.top = `${e.pageY}px`;
    cursor.style.left = `${e.pageX}px`;
  });

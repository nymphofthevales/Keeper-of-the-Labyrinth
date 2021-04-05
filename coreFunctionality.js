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
function genActions(current) {
    manageImage('remove','all','');
    //reset focus 
    let clr = document.getElementById('focus-clear');
    clr.focus();
    clr.blur();
    /*window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });*/
    if (visited.includes(current.title) === false) {
        visited.push(current.title);
    };
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

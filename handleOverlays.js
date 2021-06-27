
const {ipcRenderer} = require('electron');

//popup
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
document.getElementById('enter-button').addEventListener('click',()=>{
    loadPage(intro,0);
    runLoadingSequence();
    document.getElementById('main-menu-overlay').classList.add('invisible');
    mainMenuOpen = false;
})
document.getElementById('load-button').addEventListener('click',()=>{
    loadSaveGame();
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

function loadSaveGame() {

}
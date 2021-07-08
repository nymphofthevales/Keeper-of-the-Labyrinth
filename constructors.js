//
//For all constructor functions and the global 
//variables to store their results.
//

'use strict'

let SequenceInstances = [];
let StoryNodeInstances = [];

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function Sequence() {
    this.title = String();
    this._pages = new Array(0),
    //pages array will take format of ['page1','page2']
    this._buttons = new Array(0),
    //buttons array will take format of ['button1','button2']
    this._next = undefined
    //next is a pointer to another sequence or node object
    SequenceInstances.push(this);
};
Sequence.prototype.getPage = function(num) {
    let page = String(this._pages[num]);
    let button = String(this._buttons[num]);
    return [page, button];
    //returns in format of ['page string', 'button string']
},
Sequence.prototype.addPage = function(/*string*/text,/*string*/button) {
    this._pages.push(`${text}`);
    let num = this._pages.length - 1;
    button = capitalize(button);
    this._buttons[num] = button;
}
Sequence.prototype.addBatchPage = function(/*array*/text,/*string*/button) {
    //input takes form of (['page1','page2'],'button string'). for when all pages in an order will have the same button text.
    for (let i=0; i<text.length; i++) {
        this._pages.push(`${text[i]}`);
        button = capitalize(button);
        this._buttons.push(button);
    };
}
Sequence.prototype.setNext = function(pointer) {
    //pointer is a variable storing another sequence or node
    this._next = pointer;
}
Sequence.prototype.getNext = function() {
    return this._next;
}
Sequence.prototype.getLength = function() {
    return this._pages.length;
}

function StoryNode() {
    this.title = String();
    this._text = String();
    this._buttons = new Array();
    StoryNodeInstances.push(this);
}
StoryNode.prototype.addOption = function(name,destination) {
    //name is string, destination is a pointer to another sequence or node
    name = capitalize(name);
    this._buttons.push([name, destination]);
}
StoryNode.prototype.removeOption = function(name,destination) {
    //takes in string name and pointer destination and removes option that has either that name or that destination
    for (let i=0; i<this._buttons.length; i++) {
        if (this._buttons[i][0] === name || this._buttons[i][1] === destination) {
            this._buttons.splice(i,1);
        }
    }
}
StoryNode.prototype.clearOptions = function() {
    //removes all options from a StoryNode
    this._buttons = [];
}
StoryNode.prototype.getPage = function() {
    //returns text string and decomposes buttons in form [name,destination] -> [name,name,name]
    let text = String(this._text);
    let btns = new Array();
    for (let i=0; i<this._buttons.length; i++) {
        btns.push(this._buttons[i][0]);
    }
    return [text,btns];
    //returns format of ['string', ['btn str', 'btn str']]
}
StoryNode.prototype.getDestinations = function() {
    //decomposes buttons in form [name,destination],[name,destination] -> [destination,destination]
    let destinations = new Array();
    for (let i=0; i<this._buttons.length; i++) {
        destinations.push(this._buttons[i][1]);
    }
    return destinations;
    //index of dests array will correspond to index of buttons array returned by getPage
}
StoryNode.prototype.setText = function(text) {
    this._text = String(text);
}


function GalleryItem(unlocked,title,description,src,hasShadow) {
    this.unlocked = unlocked;
    this.title = title;
    this.description = description;
    this.src = src;
    this.hasShadow = hasShadow;
    if (this.hasShadow === false) {
        this.shadow = undefined;
    } else if (this.hasShadow === true) {
        let shadowUrl = this.src.slice(0,-4);
        shadowUrl += '_shadow.png'
        this.shadow = shadowUrl;
    }
}

function Gallery() {
    this.elements = [];
    this.lockedImage = "assets/ui/gallery-hidden-icon.png";
    this.descriptionPlaceholder = "Explore the <span class=\"labyrinth-color\">labyrinth</span> to unlock this image."
}

Gallery.prototype.addItem = function(number,unlocked,title,description,src,hasShadow) {
    this.elements[number] = new GalleryItem(unlocked,title,description,src,hasShadow);
}
Gallery.prototype.generatePreviewHTML = function(number) {
    let src = '';
    if (this.elements[number].unlocked === true) {
        src = this.elements[number].src;
    } else if (this.elements[number].unlocked === false) {
        src = this.lockedImage;
    }
    return `<div id="gallery-${number}" class="gallery-image-preview">
        <button id="gallery-${number}-button">
            <img id="gallery-${number}-preview-img" class="gallery-preview-img" src="${src}">
        </button>
    </div>`
}
Gallery.prototype.generateInspectorHTML = function(number) {
    if (this.elements[number].unlocked === true) {
        return `<div id="inspector-text-frame">
            <h2 id="image-title">${this.elements[number].title}</h2>
            <p id="image-description">${this.elements[number].description}</p> 
            <button id="gallery-back-button"></button>
        </div>
        <div id="inspector-image-frame">
            <img id="gallery-inspector-image" src="${this.elements[number].src}"/>
        </div>`
    } else if (this.elements[number].unlocked === false) {
        return `<div id="inspector-text-frame">
            <h2 id="image-title">${this.elements[number].title}</h2>
            <p id="image-description">${this.descriptionPlaceholder}</p> 
        <button id="gallery-back-button"></button>
        </div>
        <div id="inspector-image-frame">
            <img id="gallery-inspector-placeholder" src="${this.lockedImage}"/>
        </div>`
    }
}
//Gallery[1].unlock('lines')//be able to say this, causes data to be updated such that next time gallery is opened, instead of default description and hidden icon, the real image prints and the real description can be read once it's opened in the inspector window.

function Music() {
    this.songs = {};
    this._currentSong = undefined;
    this._maxVolume = (2*options.volume)/100;
    this.currentlyPlaying = false;
}
let stillFading = false;
Music.prototype.start = function(title,fadein,seconds) {
    if (options.enableMusic === true) {
        this.currentlyPlaying = true;
        this._currentSong = this.songs[title];
        this._currentSong.currentTime = 0;
        if (fadein === false) {
            this.songs[title].volume = this._maxVolume;
            this.songs[title].play();
        } else if (fadein === true) {
            this._fadeIn(seconds)
        }
    } else if (options.enableMusic === false){
        console.log('music disabled')
        return false;
    }
}
Music.prototype.addSong = function(title,url) {
    this.songs[title] = new Audio(url);
}
Music.prototype.fadeOut = function(seconds) {
    function fadeMusic(seconds,audioObject) {
        let timeout = 500;
        let step = (audioObject.volume/seconds)*(timeout/1000);
        console.log(step)
        function loop() {
            setTimeout(()=>{
                if (audioObject.volume - step < 0) {
                    audioObject.volume = 0;
                } else {
                    audioObject.volume -= step;
                }
                console.log(audioObject.volume)
                if (audioObject.volume > 0) {
                    stillFading = true;
                    loop();
                } else {
                    stillFading = false;
                    audioObject.muted = true;
                    audioObject.pause();
                    return;
                }
            },timeout)
        }
        loop();
    }
    fadeMusic(seconds,this._currentSong)
    this.currentlyPlaying = false;
}
Music.prototype._fadeIn = function(seconds) {
    let target = this._maxVolume;
    function fadeMusic(seconds,audioObject) {
        audioObject.volume = 0;
        audioObject.play();
        let timeout = 500;
        let step = (target/seconds)*(timeout/1000);
        console.log(step)
        function loop(i) {
            setTimeout(()=>{
                console.log(audioObject.volume)
                if (audioObject.volume + step > 1 || audioObject.volume + step > target) {
                    audioObject.volume = target;
                } else {
                    audioObject.volume += step;
                }
                if (audioObject.volume < target) {
                    stillFading = true;
                    loop(i+step);
                } else {
                    stillFading = false;
                    return;
                }
            },timeout)
        }
        loop(0);
    }
    fadeMusic(seconds,this._currentSong)
}
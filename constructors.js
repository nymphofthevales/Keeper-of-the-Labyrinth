'use strict'

let options = {
    "textSize":"default",
    "enableMusic":true,
    "volume":25,
    "enableParallax":true,
    "enableTextFade":true,
    "enableWarnings":false
}

//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v story content
let SequenceInstances = [];
let StoryNodeInstances = [];
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
//^ story content
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v gallery
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
    imageUrls.push(src);
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
Gallery.prototype.unlock = function(title) {
    for (let i=0; i<this.elements.length; i++) {
        if (this.elements[i].title === title) {
            this.elements[i].unlocked = true;
        }
    }
}
//^ gallery
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v music
function Music() {
    this.songs = {};
    this._currentSong = undefined;
    this._maxVolume = options.volume;
    this.currentlyPlaying = false;
}
let stillFading = false;
let stopFadeOut = false;
let stopFadeIn = false;
Music.prototype.start = function(/*string*/title,/*boolean*/fadein,/*number*/seconds) {
    if (stillFading === true) {
        setTimeout(()=>{this.start(title,fadein,seconds)},50)
    } else {
        if (options.enableMusic === true) {
            this.currentlyPlaying = true;
            this._currentSong = this.songs[title];
            this._currentSong.currentTime = 0;
            if (fadein === false) {
                this.songs[title].volume = (2*this._maxVolume)/100;
                this.songs[title].play();
            } else if (fadein === true) {
                this._fadeIn(seconds)
            }
        } else if (options.enableMusic === false){
            console.log('music disabled')
            return false;
        }
    }
}
Music.prototype.addSong = function(title,url) {
    this.songs[title] = new Audio(url);
}
Music.prototype.fadeOut = function(seconds) {
    function fadeMusic(seconds,audioObject) {
        let timeout = 50;
        let step = (audioObject.volume/seconds)*(timeout/1000);
        console.log(step)
        function loop() {
            setTimeout(()=>{
                stopFadeIn = true;
                if (audioObject.volume - step < 0) {
                    audioObject.volume = 0;
                } else {
                    audioObject.volume -= step;
                }
                console.log(audioObject.volume)
                if (audioObject.volume > 0 && stopFadeOut === false) {
                    stillFading = true;
                    loop();
                } else {
                    stillFading = false;
                    stopFadeIn = false;
                    audioObject.pause();
                    return;
                }
            },timeout)
        }
        loop();
    }
    if (this._currentSong !== undefined) {
        fadeMusic(seconds,this._currentSong)
        this.currentlyPlaying = false;
    }
}
Music.prototype._fadeIn = function(seconds) {
    let target = (2*this._maxVolume)/100;
    function fadeMusic(seconds,audioObject) {
        audioObject.volume = 0;
        audioObject.play();
        let timeout = 50;
        let step = (target/seconds)*(timeout/1000);
        console.log(step)
        function loop(i) {
            setTimeout(()=>{
                stopFadeOut = true;
                console.log(audioObject.volume)
                if (audioObject.volume + step > 1 || audioObject.volume + step > target) {
                    audioObject.volume = target;
                } else {
                    audioObject.volume += step;
                }
                if (audioObject.volume < target && stopFadeIn === false) {
                    stillFading = true;
                    loop(i+step);
                } else {
                    stillFading = false;
                    stopFadeOut = false;
                    return;
                }
            },timeout)
        }
        loop(0);
    }
    fadeMusic(seconds,this._currentSong)
}
//^ music
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v grid 
function Grid(w,h,s) {
    this.columns = w;
    this.rows = h;
    this.cellSize = s;
    this.array = [];
    for (let i=1; i <= (w * h); i++) {
        this.array.push(new MapTile(i,this,'o'))
    }
    this.print();
}
Grid.prototype.getRow = function(num) {
    return this.array.slice(num*this.columns,(num*this.columns) + this.columns);
}
Grid.prototype.getColumn = function(num) {
    let column = [];
    for (let i=0; i<this.rows; i++) {
        column.push(this.array[num + (i * this.columns)])
    }
    return column;
}
Grid.prototype.insertElement = function(coordinateArray,element,type) {
    let y = coordinateArray[1];
    let x = coordinateArray[0];
    let row = (y-1) * this.columns;
    let posXY = row + (x-1);
    if (element === 'node') {
        //this.array[posXY] = new MapNode([x,y],this,type)
        this.array[posXY] = element;
    } else if (element === 'tile') {
        this.array[posXY] = new MapTile([x,y],this,type)
    }
    document.getElementById(`cell-${x}-${y}-content`).textContent = type;
}
Grid.prototype.getElement = function(coordinateArray) {
    let y = coordinateArray[1];
    let x = coordinateArray[0];
    let row = (y-1) * this.columns;
    let posXY = row + (x-1);
    return this.array[posXY];
}
Grid.prototype.print = function() {
    createDOMGrid(this);
    drawGrid(this);
    populateGrid(this);
}
Grid.prototype.getNodeList = function() {
    let MapNodeList = [];
    for (let i=0; i<this.array.length; i++) {
        if (this.array[i].constructor === MapNode) {
            MapNodeList.push(this.array[i]);
        }
    }
    return MapNodeList;
}
//^ grid object constructor
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v map node and tile constructors
function MapNode(coordinate,GridObject,title) {
    this.title = title;
    this.parentGrid = GridObject;
    this.pageObjects = [];
    this.pageNum = 0;
    this.highlighted = false;
    this.linkages = [];
    this.position = [];
    this.distance = 0;
    if (typeof coordinate === 'object') {
        this.position = coordinate;
    }
}
MapNode.prototype.addLinkage = function(MapNodeObject) {
    this.linkages.push(MapNodeObject);
}
function MapTile(number,GridObject,type) {
    this.type = type;
    this.position = [];
    this.parentGrid = GridObject;
    this.distance = 0;
    let y = number % GridObject.columns;
    if (typeof number === 'number') {
        if (y > 0) {
            this.position[0] = y;
            this.position[1] = Math.floor(number/GridObject.columns) + 1;
        } else if (y === 0) {
            this.position[0] = GridObject.columns;
            this.position[1] = Math.floor(number/GridObject.columns);
        }
    } else if (typeof number === 'object') {
        this.position = [number[0],number[1]];
    }
}
MapTile.prototype.getAdjacent = function(direction) {
    switch (direction) {
        case 'left':
            if (this.position[0]-1 !== 0) {
                return this.parentGrid.getElement(
                    [this.position[0]-1,this.position[1]]
                    );
            } else {
                return undefined;
            }
        case 'right':
            if (this.position[0]+1 <= this.parentGrid.columns) {
                return this.parentGrid.getElement(
                    [this.position[0]+1,this.position[1]]
                    );
            } else {
                return undefined;
            }
        case 'above':
            if (this.position[1]-1 !== 0) {
                return this.parentGrid.getElement(
                    [this.position[0],this.position[1]-1]
                    );
            } else {
                return undefined;
            }
        case 'below':
            if (this.position[1]+1 <= this.parentGrid.rows) {
                return this.parentGrid.getElement(
                    [this.position[0],this.position[1]+1]
                    );
            } else {
                return undefined;
            }
    }
}
MapTile.prototype.setType = function(string) {
    this.type = string;
    //console.log(this.position);
    document.getElementById(`cell-${this.position[0]}-${this.position[1]}-content`).textContent = string;
}
function generateGridTemplate(GridObject,type) {
    let s = '';
    switch (type) {
        case 'columns':
            for (let i=0;i<GridObject.columns; i++) {
                s += `${GridObject.cellSize} `
            }
            return s;
        case 'rows':
            for (let i=0;i<GridObject.rows; i++) {
                s += `${GridObject.cellSize} `
            }
            return s;
    }
}
//^ map node and tile constructors
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v grid print functions
function createDOMGrid(GridObject) {
    document.getElementById('map-housing').appendChild(document.createElement('div')).id=`GeneratedGrid`;
    const a = document.getElementById('GeneratedGrid')
    a.style.display = 'grid';
    a.style.margin = '0';
    a.style.gridTemplateColumns = generateGridTemplate(GridObject,'columns');
    a.style.gridTemplateRows = generateGridTemplate(GridObject,'rows');

}
function drawGrid(GridObject) {
    let g = document.getElementById('GeneratedGrid')
    g.innerHTML = '';
    for (let i=1; i<=GridObject.rows; i++) {
        for (let j=1; j<=GridObject.columns; j++) {
            g.appendChild(document.createElement('div')).id= `cell-${j}-${i}`
            let cell = document.getElementById(`cell-${j}-${i}`);
            cell.style.gridColumn = `${j}/${j+1}`;
            cell.style.gridRow = `${i}/${i+1}`;
            cell.style.backgroundColor = `rgb(0,0,0)`
            cell.style.height = `${GridObject.cellSize}`;
            cell.style.width = `${GridObject.cellSize}`;
            //cell.style.border = '1px solid white'
            //cell.style.textAlign = 'center'
            cell.style.display = 'relative'
        }
    }
}
function populateGrid(GridObject) {
    for (let y = 1; y <= GridObject.rows; y++) {
        for (let x = 1; x <= GridObject.columns; x++) {
            let cell = document.getElementById(`cell-${x}-${y}`);
            cell.innerHTML = '';
            cell.appendChild(document.createElement('p')).id= `cell-${x}-${y}-content`
            let p = document.getElementById(`cell-${x}-${y}-content`)
            p.style.margin = 0;
            p.style.padding = 0;
            //p.style.color = `rgb(255,255,255)`
            p.innerText = GridObject.getColumn(x-1)[y-1].type; //SHOULD SET TYPE HERE
            p.style.display = 'absolute'
            //p.style.left = `${(1/2)*GridObject.cellSize}px`;
            //p.style.top = `${(1/2)*GridObject.cellSize}px`;
        }
    }
}
//^ grid print functions
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v misc utility functions
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
    //returns non-zero integer
}
function isEven(number) {
    let check = number/2;
    const regex = new RegExp('\\.');
    return !regex.test(''+check);
};
function dateStampToWords(date/* date as string in format "year/month/day" */) {
    let a = date.split('/');
    let year = a[0];
    let month = a[1];
    let day = a[2];
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    month = months[month];
    let s = day.charAt(day.length-1)
    switch (s) {
        case 0: day += 'th'
        break;
        case 1: day += 'st'
        break;
        case 2: day += 'nd'
        break;
        case 3: day += 'rd'
        break;
        case 4: day += 'th'
        break;
        case 5: day += 'th'
        break;
        case 6: day += 'th'
        break;
        case 7: day += 'th'
        break;
        case 8: day += 'th'
        break;
        case 9: day += 'th'
        break;
    }
    return `${month} ${day}, ${year}`
}
function clearFocus() {
    let clr = document.getElementById('focus-clear');
    clr.focus();
    clr.blur();
}
//^ misc utility functions
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
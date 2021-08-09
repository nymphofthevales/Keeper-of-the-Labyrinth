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

function Grid(w,h,s,preset) {
    if (preset === undefined) {
        this.columns = w;
        this.rows = h;
    } else if (preset !== undefined) {
        this.columns = preset.width;
        this.rows = preset.height;
    }
    this.cellSize = s;
    this.array = [];
    for (let i=1; i <= (this.columns * this.rows); i++) {
        this.array.push(new MapTile(i,this,'o'))
    }
    this.print();
    if (preset !== undefined) {
        this.loadInPresetArray(preset);
    }
    this.printMapTiles();
    this.initializeMapNodes(this.getNodes());
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
Grid.prototype.getIndexFromCoords = function(coordinateArray) {
    let y = coordinateArray[1];
    let x = coordinateArray[0];
    y-=1;
    x-=1;
    y *= this.columns;
    let index = y + x
    return index
}
Grid.prototype.getCoordsFromIndex = function(index) {
    let x = index % this.columns;
    let y = Math.floor(index/this.columns);
    return [x+1,y+1];
}
Grid.prototype.insertElement = function(coordinateArray,element,type,opts) {
    let x = coordinateArray[0];
    let y = coordinateArray[1];
    let index = this.getIndexFromCoords([x,y]);
    if (element === 'node') {
        this.array[index] = new MapNode([x,y],this,type,opts)
    } else if (element === 'tile') {
        this.array[index] = new MapTile([x,y],this,type)
    }
    document.getElementById(`cell-${x}-${y}-content`).textContent = type;
}
Grid.prototype.getElement = function(coordinateArray) {
    let index = this.getIndexFromCoords(coordinateArray)
    return this.array[index];
}
Grid.prototype.getElementDOMNode = function(index) {
    let coordinateArray = this.getCoordsFromIndex(index);
    let x = coordinateArray[0];
    let y = coordinateArray[1];
    return document.getElementById(`cell-${x}-${y}`);
}
Grid.prototype.print = function() {
    createDOMGrid(this);
    drawGrid(this);
    populateGrid(this);
}
Grid.prototype.printMapTiles = function() {
    for (let i = 0; i < this.array.length; i++) {
        let path = ''
        if (this.array[i].constructor === MapTile) {
            path = './assets/ui/tileset/passageway/'
        } else if (this.array[i].constructor === MapNode) {
            path = './assets/ui/tileset/node_'
            //console.log(this.array[i].unlocked)
            if (this.array[i].unlocked === true) {
                path += 'unlocked/'
            } else if (this.array[i].unlocked === false){
                path += 'locked/'
            }
            path += `${this.array[i].type.length}` 
            path += '/'
            //console.log(path)
        }
        let type = this.array[i].type;
        let imgUrl = path + type + '.png'
        let DOMNode = this.getElementDOMNode(i)
        DOMNode.style.backgroundImage = `url(\"${imgUrl}\")`;
        DOMNode.childNodes[0].textContent = '';
    }
}
Grid.prototype.loadInPresetArray = function(preset) {
    let tiles = preset.tiles;
    for (let i=0; i < tiles.length; i++) {
        let coordArray = tiles[i][0];
        let type = tiles[i][1];
        this.insertElement(coordArray,'tile',type)
    }
    let nodes = preset.nodes;
    for (let i=0; i < nodes.length; i++) {
        let coordArray = nodes[i][0];
        let type = nodes[i][1];
        let opts = {
            title: nodes[i][2],
            unlocked: nodes[i][3],
            pageObject: nodes[i][4]
        }
        this.insertElement(coordArray,'node',type,opts)
    }
}
Grid.prototype.tracePath = function(node1,node2) {
    let pathArray = checkGlobalConnection(node1.position,node2.position,this);
    for (let i=0; i<pathArray.length; i++) {
        
    }
}
Grid.prototype.getNodes = function() {
    let mapNodeArray = [];
    for (let i=0; i < this.array.length; i++) {
        if (this.array[i].constructor === MapNode) {
            mapNodeArray.push(this.array[i])
        }
    }
    return mapNodeArray;
}
Grid.prototype.initializeMapNodes = function(mapNodeArray) {
    let nodeDOMRefs = {}
    for (let i=0; i < mapNodeArray.length; i++) {
        //id looks like "cell-x-y"
        let x = mapNodeArray[i].position[0];
        let y = mapNodeArray[i].position[1];
        nodeDOMRefs[`node-${x}-${y}`] = document.getElementById(`cell-${x}-${y}`);
        let a = nodeDOMRefs[`node-${x}-${y}`];
        a.addEventListener('mouseover',()=>{
            hoverMapNode("hover",mapNodeArray,i);
        });
        a.addEventListener('mouseout',()=>{
            hoverMapNode("clear",mapNodeArray,i);
        })
        a.addEventListener('mousedown',()=>{
            clickMapNode(mapNodeArray,i)
        })
        a.addEventListener('mouseup',()=>{
            hoverMapNode("hover",mapNodeArray,i)
        })
    }
    return nodeDOMRefs;
}
Grid.prototype.getPreset = function() {
    let save = new MapSave(this.columns,this.rows)
    let array = this.array;
    for (let i=0; i < array.length; i++) {
        if (array[i].type !== 'o') {
            if (array[i].constructor === MapNode) {
                save.addNode(array[i]);
            } else if (array[i].constructor === MapTile) {
                save.addTile(array[i]);
            }
        }
    }
    //document.querySelector('body').appendChild(document.createElement('p')).innerText = JSON.stringify(save)
    return save;
}

//^ grid object constructor
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v map node and tile constructors

function MapNode(coordinateArray,GridObject,type,opts) {
    this.type = type;
    this.position = coordinateArray;
    this.parentGrid = GridObject;
    this.distance = 0;
    //
    this.title = opts.title;
    this.unlocked = opts.unlocked;
    this.pageObject = opts.pageObject;
    this.pageNum = 0;
    this.linkages = [];
}
MapNode.prototype.addLinkage = function(MapNodeObject) {
    this.linkages.push(MapNodeObject);
}
MapNode.prototype.__proto__ = MapTile.prototype;

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
function MapSave(w,h) {
    this.width = w;
    this.height = h;
    this.tiles = [];
    this.nodes = [];
}
MapSave.prototype.addTile = function(MapTileObject) {
    this.tiles.push([
        MapTileObject.position,
        MapTileObject.type
    ])
}
MapSave.prototype.addNode = function(MapNodeObject) {
    this.nodes.push([
        MapNodeObject.position,
        MapNodeObject.type,
        MapNodeObject.title,
        MapNodeObject.unlocked,
        MapNodeObject.pageObject
    ])
}
//^ map node and tile constructors
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v grid print functions

function createDOMGrid(GridObject) {
    document.getElementById('map').innerHTML = '';
    document.getElementById('map').appendChild(document.createElement('div')).id=`GeneratedGrid`;
    const a = document.getElementById('GeneratedGrid')
    a.style.display = 'grid';
    a.style.margin = '0';
    a.style.gridTemplateColumns = generateGridTemplate(GridObject,'columns');
    a.style.gridTemplateRows = generateGridTemplate(GridObject,'rows');
    //
    a.style.imageRendering = 'pixelated';
    //a.style.imageRendering = '-moz-crisp-edges';
    //a.style.imageRendering = 'crisp-edges';

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
            cell.style.height = `${GridObject.cellSize}`;
            cell.style.width = `${GridObject.cellSize}`;
            //cell.classList.add('grid-cell');
            cell.style.display = 'relative'
            cell.style.backgroundRepeat = 'no-repeat'
            cell.style.backgroundSize = 'contain'
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
            p.style.color = `rgb(255,255,255)`
            p.innerText = GridObject.getColumn(x-1)[y-1].position; //SHOULD SET TYPE HERE
        }
    }
}
function appendNodeTitles(GridObject) {
    let nodes = GridObject.getNodes();
    for (let i=0; i<nodes.length; i++) {
        let DOMRef = GridObject.getElementDOMNode(GridObject.getIndexFromCoords(nodes[i].position));
        let x = nodes[i].position[0];
        let y = nodes[i].position[1];
        DOMRef.innerHTML = '';
        DOMRef.classList.add('grid-node')
        DOMRef.appendChild(document.createElement('div')).id=`cell-${x}-${y}-hovertext`;
        let hoverText = document.getElementById(`cell-${x}-${y}-hovertext`)
        hoverText.classList.add('node-title');
        hoverText.appendChild(document.createElement('h3')).id=`cell-${x}-${y}-hovertext-content`
        let content = document.getElementById(`cell-${x}-${y}-hovertext-content`)
        if (nodes[i].unlocked === true) {
            content.innerText = `${nodes[i].title}`
        } else if (nodes[i].unlocked === false) {
            content.innerText = `?`
        }
    }
}
//^ grid print functions
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v pathfinding logic
function comparePosition(A,B) {
    let x;
    let y;
    if (A.position[0] > B.position[0]) {
        x=true
    } else {
        x=false
    }
    if (A.position[1] > B.position[1]) {
        y=true
    } else {
        y=false
    }
    return [x,y];
}
function checkGlobalConnection(startXY,targetXY,GridObject) {
    GridObject.print();
    let currentElement = GridObject.getElement(startXY);
    let path = [];
    let toSearch = [];
    let searching = true;
    let success = true;
    let iterations = 0;
    function addToSearch(tileElement) {
        if (toSearch.includes(tileElement) === false && path.includes(tileElement) === false) {
            toSearch.push(tileElement)
        }
    }

    generateWeightings(targetXY,GridObject)
    let finish = GridObject.getElement(targetXY);
    do {
        iterations +=1;
        if (currentElement === finish || iterations > 500) {
            searching = false;
        }
        let adjLinks = checkAdjacentConnections(currentElement.position,GridObject)
        //console.log(adjLinks)
        if (adjLinks.includes(true) === false) {
            success = false;
            searching = false;
        } else if (adjLinks.includes(true) === true) {
            for (let i = 0; i < 4; i++) {
                if (adjLinks[i] === true) {
                    switch (i) {
                        case 0: //up 
                            addToSearch(GridObject.getElement(
                                [currentElement.position[0],currentElement.position[1]-1]
                                ))
                            break;
                        case 1: //right
                            addToSearch(GridObject.getElement(
                                [currentElement.position[0]+1,currentElement.position[1]]
                                ))
                            break;
                        case 2: //down
                            addToSearch(GridObject.getElement(
                                [currentElement.position[0],currentElement.position[1]+1]
                                ))
                            break;
                        case 3: //left
                            addToSearch(GridObject.getElement(
                                [currentElement.position[0]-1,currentElement.position[1]]
                                ))
                            break;
                    }
                }
            }
        }
        let currentPreference = {};
        currentPreference['distance'] = Infinity;
        for (let i=0; i < toSearch.length; i++) {
            if (toSearch[i].distance < currentPreference.distance) {
                currentPreference = toSearch[i];
            } else if (toSearch[i].distance === currentPreference.distance) {
                if (isEven(iterations) === true) {
                    currentPreference = toSearch[i];
                }
            }
        }
        /*console.log([`current element at iteration ${iterations}:`,currentElement])
        console.log([`to search at iteration ${iterations}:`,toSearch])
        console.log([`searched at iteration ${iterations}`,searched])
        console.log([`current preference at iteration ${iterations}`,currentPreference])*/
        if (toSearch.includes(currentPreference) === true) {
            for (let i=0; i<toSearch.length; i++) {
                if (toSearch[i] === currentPreference) {
                    toSearch.splice(i,1);
                }
            }
        }
        if (currentElement === currentPreference) {
            currentPreference = toSearch[0];
        }
        document.getElementById(`cell-${currentElement.position[0]}-${currentElement.position[1]}`).style.border = `3px dashed red`;
        path.push(currentElement);
        currentElement = currentPreference;
    }
    while (searching === true)
    if (success === true) {
        return [true,path]
    } else if (success === false) {
        return [false]
    }
}
function generateRandomTestGrid(GridObject) {
    let types = ['o','<>','^v','<^>','^v>','<v>','<^v','<^v>','<^','^>','v>','<v']
    for (let i=0; i< GridObject.array.length; i++) {
        let rand = getRandomInt(types.length);
        GridObject.array[i].setType(types[rand - 1]);
    }
}
function generateWeightings(targetXY,GridObject) {
    let finish = GridObject.getElement(targetXY)
    let weightedArray = GridObject.array;
    for (let i = 0; i < weightedArray.length; i++) {
        let a = weightedArray[i];
        let distance = Math.abs(a.position[0] - finish.position[0]);
        distance += Math.abs(a.position[1] - finish.position[1]);
        a.distance = distance;
        document.getElementById(`cell-${a.position[0]}-${a.position[1]}-content`).innerText = `${distance}`
        let x;
        switch(GridObject.height > GridObject.width) {
            case true: x = GridObject.rows;
                break;
            case false: x = GridObject.columns;
                break;
        }
        let c = Math.floor(240-((240/x)*(a.distance)));
        let color = `rgb(${c},${c},108)`;
        document.getElementById(`cell-${a.position[0]}-${a.position[1]}`).style.backgroundColor = color;
    }
}
function checkAdjacentConnections(coordinateArray,GridObject) {
    let element = GridObject.getElement(coordinateArray);
    let u;
    let r;
    let d;
    let l;
    let type = element.type;
    if (element.getAdjacent('above') !== undefined) {
        if (type.includes('^') === true && element.getAdjacent('above').type.includes('v') === true) {
            u = true;
        } else {
            u = false;
        }
    } else {
        u = false;
    }
    if (element.getAdjacent('right') !== undefined) {
        if (type.includes('>') === true && element.getAdjacent('right').type.includes('<') === true) {
            r= true;
        } else {
            r = false;
        }
    } else {
        r= false;
    }
    if (element.getAdjacent('below') !== undefined) {
        if (type.includes('v') === true && element.getAdjacent('below').type.includes('^') === true) {
            d= true;
        } else {
            d = false;
        }
    } else {
        d= false;
    }
    if (element.getAdjacent('left') !== undefined) {
        if (type.includes('<') === true && element.getAdjacent('left').type.includes('>') === true) {
            l= true;
        } else {
            l = false;
        }
    } else {
        l= false;
    }
    return [u,r,d,l]
}

function generateConnections(MapNodeObject,totalNodes) {
    let w = (2 * totalNodes) + 2;
    let h = Math.floor((3/4) * w);
    if (isEven(h) === true) {
        h += 1;
    };
    let mapGrid = new Grid(w,h,'100px');
    //generate a new grid with an odd height and large enough to contain all given nodes
    mapGrid.insertElement([2,Math.floor(h/2)],MapNodeObject,'node')
    //place the first node in the middle at the left edge
    placeNewNode(mapGrid,MapNodeObject);
}
//^ map pathfinding
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//CONTENT BREAK//////////////////////////////////////////////////////////////////////////////////////////////
//v map node interaction management

function hoverMapNode(action,mapNodeArray,index) {
    let x = mapNodeArray[index].position[0];
    let y = mapNodeArray[index].position[1];
    let node = document.getElementById(`cell-${x}-${y}`);
    let type = mapNodeArray[index].type;
    let unlocked = mapNodeArray[index].unlocked;
    //./assets/ui/tileset/node_ + ${locked/unlocked} + / + ${type.length} + / + ${type} + _ + hover
    let path = './assets/ui/tileset/node_'
    if (unlocked === true) {
        path += 'unlocked/'
    } else if (unlocked === false) {
        path += 'locked/'
    }
    path += `${type.length}/`
    path += `${type}`
    if (action === 'clear') {
        path += '.png'
        node.style.backgroundImage = `url("${path}")`
    } else if (action === 'hover') {
        path += '_hover.png'
        node.style.backgroundImage = `url("${path}")`
    }
}

function clickMapNode(mapNodeArray,index) {
    let x = mapNodeArray[index].position[0];
    let y = mapNodeArray[index].position[1];
    let node = document.getElementById(`cell-${x}-${y}`);
    let type = mapNodeArray[index].type;
    let unlocked = mapNodeArray[index].unlocked;
    //./assets/ui/tileset/node_ + ${locked/unlocked} + / + ${type.length} + / + ${type} + _ + active
    let path = './assets/ui/tileset/node_'
    if (unlocked === true) {
        path += 'unlocked/'
    } else if (unlocked === false) {
        path += 'locked/'
    }
    path += `${type.length}/`
    path += `${type}_`
    path += 'active'
    path += '.png'
    //console.log(path)
    node.style.backgroundImage = `url("${path}")`
}
//^ map node interaction management
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
        case 0 || 4 || 5 || 6 || 7 || 8 || 9: day += 'th'
        break;
        case 1: day += 'st'
        break;
        case 2: day += 'nd'
        break;
        case 3: day += 'rd'
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
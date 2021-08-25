'use strict'

function Grid(w,h,s,preset) {
    if (preset === undefined) {
        this.columns = w;
        this.rows = h;
    } else if (preset !== undefined) {
        if (preset.width >= w) {
            this.columns = preset.width;
        } else {
            this.columns = w;
        }
        if (preset.height >= h) {
            this.rows = preset.height;
        } else {
            this.rows = h;
        }
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
    //this.initializeMapNodes(this.getMapNodeArray());
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
/*Grid.prototype.pruneHeight = function() {
    console.log(`height: ${this.rows}`)
    function checkTop(GridObject) {
        let topRow = GridObject.getRow(1)
        for (let i=0; i < topRow.length; i++) {
            console.log(topRow[i].type)
            if (topRow[i].type !== 'o') {
                console.log(true)
                return true
            }
        }
        return false
    }
    function checkBottom(GridObject) {
        let bottomRow = GridObject.getRow(GridObject.rows);
        for (let i=0; i < bottomRow.length; i++) {
            if (bottomRow[i].type !== 'o') {
                console.log(true)
                return true
            }
        }
        return false
    }
    let top = checkTop(this)
    let iteration = 1;
    let working = true;
    while (top === false) {
        for (let i = 1; i <= this.rows; i++) {
            let row = this.getRow(i)
            for (let j=0; j < row.length; j++){
                row[j].position[1] -= 1;
                //console.log(row[j].position)
                //if (this.array[i].position[1] < 1) {
                //    this.array.splice(i,1);
                //}
            }
        }
        if (checkTop(this) === true && iteration % this.columns === 0) {
            working = false;
        }
        iteration += 1;
        console.log(iteration)
        top = checkTop(this)
    }
    let bottom = checkBottom(this)
    while (bottom === false) {
        this.rows -= 1;
        bottom = checkBottom(this);
    }
    console.log(`height: ${this.rows}`)
    this.print();
    //this.printMapTiles();
    //this.initializeMapNodes(this.getMapNodeArray());
}
Grid.prototype.pruneWidth = function() {
    function checkLeft(GridObject) {
        let leftColumn = GridObject.getColumn(1)
        for (let i=0; i < leftColumn.length; i++) {
            if (leftColumn[i].type !== 'o') {
                return true
            }
        }
        return false
    }
    function checkRight(GridObject) {
        let rightColumn = GridObject.getColumn(this.columns - 1);
        for (let i=0; i < rightColumn.length; i++) {
            if (rightColumn[i].type !== 'o') {
                return true
            }
        }
        return false
    }
    while (checkLeft(this) === false) {
        for (let i = 0; i < this.array.length; i++) {
            this.array[i].position[1] -= 1;
        }
    }
    while (checkRight(this) === false) {
        this.columns -= 1;
    }
    this.print();
}
*/
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
        let type = '';
        for (let a=0; a<this.array[i].type.length; a++) {
            //console.log(this.array[i].type.charAt(a))
            if (a>0 && a<type.length) {
                type += '_'
            }
            switch (this.array[i].type.charAt(a)) {
                case "<": type += "left"
                    break;
                case "^": type += "up"
                    break;
                case "v": type += "down"
                    break;
                case ">": type += "right"
                    break;
                case "o": type += "none"
                    break;
            }
        }
        //console.log(type)
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
        }
        this.insertElement(coordArray,'node',type,opts)
    }
}
Grid.prototype.tracePath = function(node1,node2) {
    let pathArray = checkGlobalConnection(node1.position,node2.position,this);
    for (let i=0; i<pathArray.length; i++) {
        
    }
}
Grid.prototype.getMapNodeArray = function() {
    let mapNodeArray = [];
    for (let i=0; i < this.array.length; i++) {
        if (this.array[i].constructor === MapNode) {
            mapNodeArray.push(this.array[i])
        }
    }
    return mapNodeArray;
}
Grid.prototype.getTileArray = function() {
    let tileArray = [];
    for (let i=0; i < this.array.length; i++) {
        if (this.array[i].constructor === MapTile) {
            tileArray.push(this.array[i])
        }
    }
    return tileArray;
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

function MapNode(coordinateArray,GridObject,type,opts) {
    this.type = type;
    this.position = coordinateArray;
    this.parentGrid = GridObject;
    this.distance = 0;
    //
    this.title = opts.title;
    this.unlocked = opts.unlocked;
    this.pageObjects = opts.pageObjects;
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
function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}
function isEven(number) {
    let check = number/2;
    const regex = new RegExp('\\.');
    return !regex.test(''+check);
};
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
        MapTileObject.type,
    ])
}
MapSave.prototype.addNode = function(MapNodeObject) {
    this.nodes.push([
        MapNodeObject.position,
        MapNodeObject.type,
        MapNodeObject.title,
        MapNodeObject.unlocked,
        MapNodeObject.pageObjects
    ])
}
function createDOMGrid(GridObject) {
    if (document.getElementById('GeneratedGrid') === null) {
        document.querySelector('body').appendChild(document.createElement('div')).id=`GeneratedGrid`;
    }
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
            cell.style.backgroundColor = `rgb(0,0,0)`
            cell.style.height = `${GridObject.cellSize}`;
            cell.style.width = `${GridObject.cellSize}`;
            //
            //cell.style.border = '1px solid white'
            //cell.style.textAlign = 'center'
            cell.style.display = 'relative'
            cell.style.backgroundRepeat = 'no-repeat'
            cell.style.backgroundSize = 'contain'
            //
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
            p.innerText = GridObject.getColumn(x-1)[y-1].position;
            //
            //v visual editor code
            //
            cell.appendChild(document.createElement('select')).id=`cell-${x}-${y}-type-dropdown`;
            cell.appendChild(document.createElement('select')).id=`cell-${x}-${y}-node-dropdown`;
            let types = ['o','<>','^v','<^>','^v>','<v>','<^v','<^v>','<^','^>','v>','<v','^','>','v','<']
            let typeDropdown = document.getElementById(`cell-${x}-${y}-type-dropdown`);
            let nodeDropdown = document.getElementById(`cell-${x}-${y}-node-dropdown`)
            for (let i=0; i < types.length; i++) {
                typeDropdown.appendChild(document.createElement('option')).id = `${x}-${y}-option-${types[i]}`
                document.getElementById(`${x}-${y}-option-${types[i]}`).value = `${types[i]}`
                document.getElementById(`${x}-${y}-option-${types[i]}`).innerText = `${types[i]}`
            }
            nodeDropdown.appendChild(document.createElement('option')).id=`${x}-${y}-option-tile`
            document.getElementById(`${x}-${y}-option-tile`).value = "tile";
            document.getElementById(`${x}-${y}-option-tile`).innerText = "tile";
            //
            nodeDropdown.appendChild(document.createElement('option')).id=`${x}-${y}-option-node`
            document.getElementById(`${x}-${y}-option-node`).value = "node";
            document.getElementById(`${x}-${y}-option-node`).innerText = "node";
            //
            typeDropdown.addEventListener('change',()=>{
                readInput([x,y],GridObject)
            })
            nodeDropdown.addEventListener('change',()=>{
                readInput([x,y],GridObject)
            })
            let children = cell.childNodes;
            for (let i=0; i<children.length; i++) {
                children[i].style.opacity = 0.3;
            }
        }
    }
}
function readInput(coordinateArray,GridObject) {
    let x = coordinateArray[0];
    let y = coordinateArray[1];
    let cell = document.getElementById(`cell-${x}-${y}`)
    let typeDropdown = document.getElementById(`cell-${x}-${y}-type-dropdown`)
    let nodeDropdown = document.getElementById(`cell-${x}-${y}-node-dropdown`)
    let element = GridObject.getElement(coordinateArray);
    element.type = typeDropdown.value;
    if (nodeDropdown.value === "node" && document.getElementById(`cell-${x}-${y}-unlocked`) === null) {
        cell.appendChild(document.createElement('input')).id=`cell-${x}-${y}-title`;
        cell.appendChild(document.createElement('input')).id=`cell-${x}-${y}-unlocked`;
        let title = document.getElementById(`cell-${x}-${y}-title`)
        title.value = "title";
        title.style.opacity = 0.3;
        let unlocked = document.getElementById(`cell-${x}-${y}-unlocked`)
        unlocked.value = "pageObject";
        unlocked.style.opacity = 0.3;
        document.getElementById(`cell-${x}-${y}-title`).addEventListener('change',()=>{
            readInput([x,y],GridObject)
        })
        document.getElementById(`cell-${x}-${y}-unlocked`).addEventListener('change',()=>{
            readInput([x,y],GridObject)
        })
    } else if (nodeDropdown.value === "node" && document.getElementById(`cell-${x}-${y}-unlocked`) !== null) {
        let pageObjects = document.getElementById(`cell-${x}-${y}-unlocked`).value.split(',')
        let pageObjectArray = [];
        for (let v=0; v<pageObjects.length; v++) {
            pageObjectArray.push(`\"${pageObjects[i]}\"`)
        }
        GridObject.insertElement(coordinateArray,'node',typeDropdown.value,{
            title: document.getElementById(`cell-${x}-${y}-title`).value,
            unlocked: false,
            //unlocked: JSON.parse(document.getElementById(`cell-${x}-${y}-unlocked`).value)
            pageObjects: pageObjectArray //JSON.parse("[" + document.getElementById(`cell-${x}-${y}-unlocked`).value + "]")
        })
    } else if (nodeDropdown.value === "tile" && document.getElementById(`cell-${x}-${y}-unlocked`) !== null) {
        document.getElementById(`cell-${x}-${y}-title`).remove();
        document.getElementById(`cell-${x}-${y}-unlocked`).remove();
        GridObject.insertElement(coordinateArray,'tile',typeDropdown.value)
    }
    GridObject.printMapTiles();
}
function outputSave(GridObject) {
    let save = new MapSave(GridObject.columns,GridObject.rows)
    let array = GridObject.array;
    for (let i=0; i < array.length; i++) {
        if (array[i].type !== 'o') {
            if (array[i].constructor === MapNode) {
                save.addNode(array[i]);
            } else if (array[i].constructor === MapTile) {
                save.addTile(array[i]);
            }
        }
    }
    document.querySelector('body').appendChild(document.createElement('p')).innerText = JSON.stringify(save)
    return save;
}
//^ constructors
//CONTENT BREAK
//v logic
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
    let typeString = '';
    for (let a=0; a<type.length; a++) {
        //console.log(type.charAt(a))
        if (a>0 && a<type.length) {
            typeString += '_'
        }
        switch (type.charAt(a)) {
            case "<": typeString += "left"
                break;
            case "^": typeString += "up"
                break;
            case "v": typeString += "down"
                break;
            case ">": typeString += "right"
                break;
            case "o": typeString += "none"
                break;
        }
    }
    path += typeString;
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
    let typeString = '';
    for (let a=0; a<type.length; a++) {
        //console.log(type.charAt(a))
        if (a>0 && a<type.length) {
            typeString += '_'
        }
        switch (type.charAt(a)) {
            case "<": typeString += "left"
                break;
            case "^": typeString += "up"
                break;
            case "v": typeString += "down"
                break;
            case ">": typeString += "right"
                break;
            case "o": typeString += "none"
                break;
        }
    }
    path += `${typeString}_`
    path += 'active'
    path += '.png'
    //console.log(path)
    node.style.backgroundImage = `url("${path}")`
}

'use strict'

function Grid(w,h,s) {
    this.columns = w;
    this.rows = h;
    this.cellSize = s;
    this.array = [];
    for (let i=1; i <= (w * h); i++) {
        this.array.push(new MapTile(i,this,'<^v>'))
    }
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

function MapNode(coordinate,GridObject,title) {
    this.title = title;
    /*this.pageObjects = [];
    this.pageNum = 0;
    this.highlighted = false;*/
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
    console.log(this.position);
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
function createDOMGrid(GridObject) {
    document.querySelector('body').appendChild(document.createElement('div')).id=`GeneratedGrid`;
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
            cell.style.border = '1px solid white'
            cell.style.textAlign = 'center'
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
            p.style.color = `rgb(255,255,255)`
            p.innerText = GridObject.getColumn(x-1)[y-1].distance; //SHOULD SET TYPE HERE
            p.style.display = 'absolute'
            p.style.left = `${(1/2)*GridObject.cellSize}px`;
            p.style.top = `${(1/2)*GridObject.cellSize}px`;
        }
    }
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
function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}
function isEven(number) {
    let check = number/2;
    const regex = new RegExp('\\.');
    return !regex.test(''+check);
};

//test nodes

function placeNewNode(GridObject,MapNodeObject) {

}

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
    let currentElement = GridObject.getElement(startXY);
    let path = [];
    let toSearch = [];
    let searched = [];
    let searching = true;
    let iterations = 0;
    function addToSearch(tileElement) {
        if (toSearch.includes(tileElement) === false && searched.includes(tileElement) === false) {
            toSearch.push(tileElement)
        }
    }

    generateWeightings(targetXY,GridObject)
    let finish = GridObject.getElement(targetXY);
    path.push(currentElement);
    do {
        iterations +=1;
        if (currentElement === finish || iterations > 50) {
            searching = false;
        }
        let adjLinks = checkAdjacentConnections(currentElement.position,GridObject)
        console.log(adjLinks)
        if (adjLinks.includes(true) === false) {
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
        let currentPreference;
        for (let i = 0; i < toSearch.length; i++) {
            for (let l = (i + 1); l < toSearch.length; l++) {
                //console.log([`comparing`,toSearch[i],`to`,toSearch[l]])
                if (toSearch[i].distance === toSearch[l].distance) {
                    if (Math.floor(Math.random()*2) === 1) {
                        currentPreference = toSearch[i];
                    } else {
                        currentPreference = toSearch[l];
                    }
                } else if (toSearch[i].distance > toSearch[l].distance) {
                    currentPreference = toSearch[l]
                } else if (toSearch[i].distance < toSearch[l].distance) {
                    currentPreference = toSearch[i]
                }
            }
        }
        if (currentElement === currentPreference) {
            currentPreference = toSearch[0];
        }
        console.log([`current element at iteration ${iterations}:`,currentElement])
        console.log([`to search at iteration ${iterations}:`,toSearch])
        console.log([`searched at iteration ${iterations}`,searched])
        console.log([`current preference at iteration ${iterations}`,currentPreference])
        if (toSearch.includes(currentPreference) === true) {
            for (let i=0; i<toSearch.length; i++) {
                if (toSearch[i] === currentPreference) {
                    toSearch.splice(i,1);
                }
            }
        }
        document.getElementById(`cell-${currentElement.position[0]}-${currentElement.position[1]}`).style.border = `3px dashed red`;
        searched.push(currentElement);
        currentElement = currentPreference;
    }
    while (searching === true)
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
        }
    } else {
        u = false;
    }
    if (element.getAdjacent('right') !== undefined) {
        if (type.includes('>') === true && element.getAdjacent('right').type.includes('<') === true) {
            r= true;
        }
    } else {
        r= false;
    }
    if (element.getAdjacent('below') !== undefined) {
        if (type.includes('v') === true && element.getAdjacent('below').type.includes('^') === true) {
            d= true;
        }
    } else {
        d= false;
    }
    if (element.getAdjacent('left') !== undefined) {
        if (type.includes('<') === true && element.getAdjacent('left').type.includes('>') === true) {
            l= true;
        }
    } else {
        l= false;
    }
    return [u,r,d,l]
}

function generateRandomTestGrid(GridObject) {
    let types = ['o','<>','^v','<^>','^v>','<v>','<^v','<^v>','<^','^>','v>','<v']
    for (let i=0; i< GridObject.array.length; i++) {
        console.log(i)
        let rand = getRandomInt(types.length);
        console.log(rand)
        console.log(types[rand])
        GridObject.array[i].setType(types[rand - 1]);
    }
}
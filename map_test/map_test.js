function Grid(w,h,s) {
    this.columns = w;
    this.rows = h;
    this.cellSize = s;
    this.array = [];
    for (let i=1; i <= (w * h); i++) {
        this.array.push(new MapTile(i,this,'o'))
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
Grid.prototype.insertElement = function(element,type,x,y) {
    let row = (y-1) * this.columns;
    posXY = row + (x-1);
    if (element === 'node') {
        //this.array[posXY] = new MapNode([x,y],this,type)
        this.array[posXY] = element;
    } else if (element === 'tile') {
        this.array[posXY] = new MapTile([x,y],this,type)
    }
    document.getElementById(`cell-${x}-${y}-content`).textContent = type;
}
Grid.prototype.getElement = function(x,y) {
    let row = (y-1) * this.columns;
    posXY = row + (x-1);
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
    let y = Math.floor(number/GridObject.columns);
    if (typeof number === 'number') {
        this.position[1] = y + 1;
        if (y > 0) {
            this.position[0] = number - (GridObject.columns * y)
        } else if (y === 0) {
            this.position[0] = number;
        }
    } else if (typeof number === 'object') {
        this.position = [number[0],number[1]];
    }
}
MapTile.prototype.getAdjacent = function(direction) {
    switch (direction) {
        case 'left':
            return this.parentGrid.getElement((this.position[0]-1),this.position[1]);
        case 'right':
            return this.parentGrid.getElement((this.position[0]+1),this.position[1]);
        case 'above':
            return this.parentGrid.getElement(this.position[0],this.position[1]-1);
        case 'below':
            return this.parentGrid.getElement(this.position[0],this.position[1]-1);
    }
}
MapTile.prototype.setType = function(string) {
    this.type = string;
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
            p.innerText = GridObject.getColumn(x-1)[y-1].type;
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
    mapGrid.insertElement(MapNodeObject,'node',2,Math.floor(h/2))
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

function comparePosition(A,direction,B) {
    switch (direction) {
        case 'left':
            if (A.position[0] < B.position[0]) {
                return true;
            } else {
                return false;
            }
        case 'right':
            if (A.position[0] > B.position[0]) {
                return true;
            } else {
                return false;
            }
        case 'above':
            if (A.position[1] < B.position[1]) {
                return true;
            } else {
                return false;
            }
        case 'below':
            if (A.position[1] > B.position[1]) {
                return true;
            } else {
                return false;
            }
    }
}
function checkGlobalConnection(x1,y1,x2,y2,GridObject) {
    let currentX = x1;
    let currentY = y1;
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    let linkTracing = [];
    let connectionAvailable = true;
    let searching = true;
    let success = false;
    //let currentDiffX = x2 - currentX;
    //let currentDiffY = y2 - currentY;
    do {
        if (currentX === x2 && currentY === y2) {
            console.log([`Path found through`,linkTracing])
            success = true;
            searching = false;
        } else {
            if (connectionAvailable === false) {
                console.log(['No connection found.',])
                success = false;
                searching = false;
            } else {
                iterateOverConnections()
            }
        }
    }
    while (searching === true)
    if (success === true) {
        return true;
    } else if (success === false) {
        return false;
    }
    function iterateOverConnections() {
        let adjLinks = [];
        for (let i=1; i<=4; i++) {
            if (checkAdjacentConnection(currentX,currentY,GridObject,i) === true) {
                adjLinks.push(true);
            } else {
                adjLinks.push(false);
            }
            console.log(adjLinks)
        }
        linkTracing.push(GridObject.getElement(currentX,currentY));
        if (adjLinks.includes(true) === false) {
            console.log(adjLinks)
            connectionAvailable = false;
        } else if (adjLinks.includes(true) === true) {
            for (let i=0; i<adjLinks.length; i++) {
                if (adjLinks[i] === true) {
                    switch (i+1) {
                    case 1: if (checkDiff((currentY - 1),'vert') === true) {
                        currentY -= 1;
                    }
                        break;
                    case 2: if (checkDiff((currentX + 1),'lat') === true) {
                        currentX += 1;
                    }
                        break;
                    case 3: if (checkDiff((currentY + 1),'vert') === true) {
                        currentY +=1;
                    }
                        break;
                    }
                }
            }
        }
    }
    
    function checkDiff(num,direction) {
        //returns true if path brings diff closer to endpoint
        switch (direction) {
            case 'vert': if ((y2 - num) > diffY) {
                return false;
            } else if ((y2 - num) < diffY) {
                return true;
            }
            case 'lat': if ((x2 - num) > diffX) {
                return false;
            } else if ((x2 - num) < diffX) {
                return true;
            }
        }
    }
}
function checkAdjacentConnection(x,y,GridObject,direction) {
    let element = GridObject.getElement(x,y);
    let type = element.type;
    switch(direction) {
        //direction is numbered clockwise
        case 1: //up
        if (type.includes('^') === true && element.getAdjacent('above').type.includes('v') === true) {
            return true;
        } else {
            return false;
        }
        case 2: //right
        if (type.includes('>') === true && element.getAdjacent('right').type.includes('<') === true) {
            return true;
        } else {
            return false;
        }
        case 3: //down
        if (type.includes('v') === true && element.getAdjacent('below').type.includes('^') === true) {
            return true;
        } else {
            return false;
        }
        case 4: //left
        if (type.includes('<') === true && element.getAdjacent('left').type.includes('>') === true) {
            return true;
        } else {
            return false;
        }
    }
}
function Grid(w,h,s) {
    this.columns = w;
    this.rows = h;
    this.cellSize = s;
    this.array = [];
    for (let i=1; i <= (w * h); i++) {
        this.array.push(new MapTile(i,this))
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
Grid.prototype.insertElement = function(element,x,y) {
    let row = (x-1) * this.columns;
    posXY = row + (y-1);
    this.array[posXY] = element;
    document.getElementById(`cell-${y}-${x}-content`).textContent = element;
}
Grid.prototype.getElement = function(x,y) {
    let row = x * this.columns;
    posXY = row + y;
    return this.array[posXY];
}
Grid.prototype.print = function() {
    createDOMGrid(this);
    drawGrid(this);
    populateGrid(this);
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

let testMap = new Grid(10,5);
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
            p.innerText = GridObject.getColumn(x-1)[y-1];
            p.style.display = 'absolute'
            p.style.left = `${(1/2)*GridObject.cellSize}px`;
            p.style.top = `${(1/2)*GridObject.cellSize}px`;
        }
    }
}



function MapNode(title) {
    this.title = title;
    /*this.pageObjects = [];
    this.pageNum = 0;
    this.highlighted = false;*/
    this.linkage = [];
    this.position = [0,0];
}
MapNode.prototype

function MapTile(number,GridObject) {
    this.type = type;
    this.position = [];
    if (number > GridObject.columns) {
        this.position[]
    } else if (number < GridObject.columns) {
        this.position[0] = 1
    }
}

function compareNodePosition() {

}
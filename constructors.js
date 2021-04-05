function capitalize(s) {
    //let str = s.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
}

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
    num = this._pages.length - 1;
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



let SequencesTest = {}
function createSequence(name) {
    name = name.toString();
    SequencesTest[name] = new Sequence();
    SequencesTest[name].title = `${name}`
    return SequencesTest;
}


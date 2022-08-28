import { StoryNode } from "./story.js";
import { StoryOption } from "./StoryOption.js";
import { Form } from "./form.js";
import { forEachInClass, listen } from "./dom_helpers.js";
import { ConditionalOptionForm } from "./ConditionalOptionForm.js";
export class ReaderState {
}
export class StoryRenderer {
    constructor(story, title, hasEditor) {
        this.story = story;
        this.hasEditor = hasEditor ? hasEditor : false;
        this.sessionID = title + "-" + Date.now();
        this.visitedNodes = new Set();
        this.visitedNodes.add(this.story.title(this.story.currentNode));
    }
    render() {
        this.renderStoryView();
        if (this.hasEditor) {
            this.renderEditorView();
        }
    }
    renderEditorView() {
        this.setContentViewer();
        this.setChildViewer();
        this.setAncestorViewer();
        this.updateStoryNodeLists();
        this.renderPreview();
        this.fillConditionalOptionsMenu();
    }
    renderStoryView() {
        this.setStoryText();
        this.setStoryOptions();
        this.handleNodeTraversalEffects();
    }
    clearStoryText() {
        document.getElementById("story-text").innerHTML = "";
    }
    setStoryText() {
        this.clearStoryText();
        let current = this.story.currentNode;
        document.getElementById("story-text").innerHTML = current.content;
    }
    clearStoryOptions() {
        document.getElementById("story-options").innerHTML = "";
    }
    setStoryOptions() {
        this.clearStoryOptions();
        let current = this.story.currentNode;
        let currentOptions = this.story.options(current);
        let storyOptionsFrame = document.getElementById("story-options");
        currentOptions.forEach((option, same, set) => {
            if (!option.isDisabled(this.visitedNodes)) {
                this.applyStoryOptionToFrame(option, storyOptionsFrame);
            }
        });
    }
    applyStoryOptionToFrame(option, frame) {
        let title = this.story.title(option.destination);
        let optionText = option.text;
        //TODO OPTION IDENTITY
        frame.appendChild(this.generateStoryOptionDOMNode(option.optionID, optionText));
        document.getElementById(`story-option-${option.optionID}`).addEventListener('mouseup', () => {
            this.traverseOption(option);
        });
    }
    handleNodeTraversalEffects() {
        if (this.story.currentNode.hasTraversalEffects) {
            //trigger image, music, etc. events
        }
    }
    generateStoryOptionDOMNode(optionID, optionText) {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = this.generateStoryOptionButtonHTML(optionID, optionText);
        return wrapper.firstChild;
    }
    generateStoryOptionButtonHTML(optionID, optionText) {
        return `<button id="story-option-${optionID}"> ${optionText} </button>`;
    }
    renderPreview() {
        let iframe = document.getElementById("preview-frame");
        iframe.srcdoc = `
        <html>
            <head>
                <link rel="stylesheet" href="./userPreviewStyle.css">
            </head>
            <body>
                <div id="story-content-preview">${this.story.currentNode.content}</div>
            </body>
        </html>`;
    }
    setCurrentData(content) {
        this.story.currentNode.content = content;
    }
    setContentViewer() {
        let contentViewer = document.getElementById("current-content-editor");
        let titleViewer = document.getElementById("current-title");
        let current = this.story.currentNode;
        contentViewer.value = current.content;
        titleViewer.innerText = this.story.title(current);
    }
    setAncestorViewer() {
        forEachInClass("ancestor-node", (element) => {
            element.remove();
        });
        let currentAncestors = this.story.ancestralAdjacencies(this.story.currentNode);
        currentAncestors.forEach((storyNode) => {
            this.placeAncestorNode(storyNode);
        });
    }
    setChildViewer() {
        forEachInClass("child-bundle", (element) => {
            element.remove();
        });
        let currentOptions = this.story.options(this.story.currentNode);
        currentOptions.forEach((option) => {
            this.placeChildNode(option);
        });
    }
    /**
     * Using the user-provided data in the newChild form, adds an option to the currently selected node.
     * If the destination node specified does not exist in the current story, makes a new empty node with the provided title.
     */
    linkNewChild(renderer, { optionText, destinationTitle }) {
        let destinationNode;
        if (this.story.has(destinationTitle)) {
            destinationNode = this.story.node(destinationTitle);
            console.log("had node");
        }
        else {
            destinationNode = this.story.addNode(destinationTitle, new StoryNode());
            console.log("didnt");
        }
        let option = new StoryOption(optionText, destinationNode);
        this.story.addOption(this.story.currentNode, option);
        renderer.placeChildNode(option);
    }
    placeChildNode(option) {
        let viewer = document.getElementById("children");
        let title = this.story.title(option.destination);
        let optionID = option.optionID;
        let content = option.destination.content;
        content = content.slice(0, 50) + "...";
        let childNode = this.createChildNodeDOMNode(title, option);
        viewer.appendChild(childNode);
        document.getElementById(`child-${optionID}-content-preview`).innerText = content;
        this.setupChildOptionForm(option, `child-${optionID}-option-text`);
        listen(`child-${optionID}-traversal`, `click`, () => { this.traverseOption(option); });
        listen(`remove-child-${optionID}`, `mouseup`, () => { this.removeChild(option); });
    }
    setupChildOptionForm(option, elementId) {
        let childOptionForm = new Form(elementId);
        childOptionForm.addInput("text", elementId);
        childOptionForm.submitInput = elementId;
        childOptionForm.onSubmit = () => {
            this.changeOptionText(option, childOptionForm);
            this.render();
        };
    }
    changeOptionText(option, childOptionForm) {
        let { text } = childOptionForm.read();
        option.text = text;
    }
    createChildNodeDOMNode(title, option) {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = this.generateChildNodeInnerHTML(title, option);
        return wrapper.firstChild;
    }
    generateChildNodeInnerHTML(title, option) {
        let text = option.text;
        let id = option.optionID;
        return `<div id="child-${id}-bundle" class="child-bundle">
                <form action="javascript:void(0);" id="child-${id}-option-form" class="option-form">
                <label for="child-${id}-option-text">Story option:</label>
                <input type="text" id="child-${id}-option-text" value="${text}">
            </form>
            <button id="child-${id}-traversal" class="story-node child-node">
                <h2 id="child-${id}-title">${title}</h2>
                <p id="child-${id}-content-preview"></p>
            </button>
            <button id="remove-child-${id}" class="remove-child">—</button>
        </div>`;
    }
    removeChild(option) {
        this.story.removeOption(this.story.currentNode, option);
        document.getElementById(`child-${option.optionID}-bundle`).remove();
        this.updateStoryNodeLists();
    }
    placeAncestorNode(ancestor) {
        let viewer = document.getElementById("ancestors");
        let title = this.story.title(ancestor);
        let content = ancestor.content;
        content = content.slice(0, 50) + "...";
        let ancestorNode = this.createAncestorDOMNode(title);
        viewer.appendChild(ancestorNode);
        document.getElementById(`parent-${title}-content-preview`).innerText = content;
        document.getElementById(`parent-${title}`).addEventListener("click", () => {
            this.traverseTo(ancestor);
        });
    }
    createAncestorDOMNode(title) {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = this.generateAncestorNodeInnerHTML(title);
        return wrapper.firstElementChild;
    }
    generateAncestorNodeInnerHTML(title) {
        return `
        <button id="parent-${title}" class="story-node ancestor-node">
            <h2 id="parent-${title}-title">${title}</h2>
            <p id="parent-${title}-content-preview"></p>
        </button>
        `;
    }
    updateStoryNodeLists() {
        var _a;
        //TEMP iterating through all nodes every time may cause performance issues.
        let nodeTitles = this.generateNodeTitlesList();
        let longestSize = (_a = getLastElement(nodeTitles)) === null || _a === void 0 ? void 0 : _a.length;
        nodeTitles.sort();
        forEachInClass("story-node-selector", (element) => {
            element.innerHTML = '';
            this.appendNodeTitleOptionList(element, nodeTitles, longestSize);
        });
        this.appendNodeTitleLiList(document.getElementById("node-index-ul"), nodeTitles);
    }
    appendNodeTitleOptionList(select, nodeTitles, longestSize) {
        for (let i = 0; i < nodeTitles.length; i++) {
            let title = nodeTitles[i];
            let opt = document.createElement("option");
            select.appendChild(opt).id = `story-node-selector-${select.id}-${title}`;
            let optionReference = document.getElementById(`story-node-selector-${select.id}-${title}`);
            optionReference.value = title;
            let previewText = this.generateNodeSelectPreviewText(title, longestSize);
            optionReference.innerText = `${title}: ${previewText}`;
        }
    }
    appendNodeTitleLiList(list, nodeTitles) {
        list.innerHTML = "";
        for (let i = 0; i < nodeTitles.length; i++) {
            let title = nodeTitles[i];
            let li = document.createElement("li");
            list.appendChild(li).id = `story-node-index-${title}`;
            let liReference = document.getElementById(`story-node-index-${title}`);
            liReference.innerHTML = `<a id="story-node-index-${title}-link">${title}</a>`;
            document.getElementById(`story-node-index-${title}-link`).addEventListener('click', () => {
                this.traverseTo(this.story.node(title));
                document.getElementById("popup-overlay").classList.add("hidden");
                document.getElementById("node-index").classList.add("hidden");
            });
        }
    }
    generateNodeTitlesList() {
        let nodeTitles = [];
        this.story.forEachNode((node, title) => {
            let lastElement = nodeTitles[nodeTitles.length - 1];
            if (lastElement != undefined) {
                if (title.length >= lastElement.length) {
                    nodeTitles.push(title);
                }
                else {
                    nodeTitles.unshift(title);
                }
            }
            else {
                nodeTitles.push(title);
            }
        }, nodeTitles);
        return nodeTitles;
    }
    generateNodeSelectPreviewText(title, longestTitleLength) {
        let defaultLength = 5;
        let previewLength;
        if (longestTitleLength < 30) {
            previewLength = (30 - title.length) + defaultLength;
        }
        else {
            previewLength = (longestTitleLength - title.length) + defaultLength;
        }
        let previewText = this.story.node(title).content.slice(0, previewLength);
        return previewText;
    }
    fillConditionalOptionsMenu() {
        let current = this.story.currentNode;
        let currentOptions = this.story.options(current);
        let optionsMenu = document.getElementById("conditional-options-selection");
        let conditionalForms = {};
        optionsMenu.innerHTML = "";
        currentOptions.forEach((option) => {
            console.log(option.text);
            let conditionalOptionForm = new ConditionalOptionForm(this.story, option);
            conditionalOptionForm.anchorTo(optionsMenu);
            conditionalForms[option.optionID] = conditionalOptionForm;
        });
    }
    traverseOption(option) {
        this.story.traverse(option);
        //TODO EVENT trigger traverse option
        this.visitedNodes.add(this.story.title(this.story.currentNode));
        //TODO EVENT trigger visited current
        this.render();
    }
    traverseTo(node) {
        this.story.setCurrent(node);
        this.render();
    }
}
function getLastElement(a) {
    return a[a.length - 1];
}

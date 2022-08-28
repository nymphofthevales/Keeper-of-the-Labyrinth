import { Story } from "./Story.js";
import { writeStoryData, readStoryData } from "./StoryIO.js";
let fs = require("fs");
/**
 * Creates a story from file if the given filename exists, else creates a new story.
*/
export function prepareStoryInstance(storyFileName, existingRootNode) {
    let story;
    if (storyFileName) {
        story = readStoryData(storyFileName);
    }
    else {
        story = new Story();
    }
    if (existingRootNode != undefined && existingRootNode != "root") {
        story.current = story.node(existingRootNode);
    }
    return story;
}
/**
 * Makes the enter key blur the focused element,
 * causing inputs and textareas to fire "change" events when entered on.
 * Shift + Enter bypasses the blur in order to allow the entry of newlines.
*/
export function useEnterToSubmit() {
    window.addEventListener('keydown', (e) => {
        if (e.key == "Enter" && e.getModifierState("Shift") == false) {
            if (!(document.activeElement.tagName == "BODY" || document.activeElement.tagName == null)) {
                let activeElement = document.activeElement;
                activeElement.blur();
                console.log('blurred');
            }
        }
    });
}
export function addChild(renderer, newChildForm) {
    newChildForm.hide();
    renderer.linkNewChild(renderer, newChildForm.read());
    newChildForm.clearInputs();
}
export function shiftCurrent(renderer, currentSelectForm) {
    let { selection } = currentSelectForm.read();
    if (renderer.story.nodes.has(selection)) {
        renderer.traverseTo(renderer.story.node(selection));
    }
    currentSelectForm.clearInputs();
    document.getElementById("current-node-select").blur();
}
export function removeCurrent(renderer, removeCurrentForm) {
    if (renderer.story.title(renderer.story.currentNode) != "root") {
        renderer.story.removeNode(renderer.story.currentNode);
        renderer.traverseTo(renderer.story.node('root'));
        renderer.render();
    }
    else {
        throw new Error("Root node cannot be removed.");
    }
    removeCurrentForm.hide();
}
export function saveState(renderer, savePopup) {
    savePopup.show();
    let failedSave = setTimeout(() => {
        alert("Save process took too long. There may be an error.");
    }, 5000);
    writeStoryData(renderer.story, renderer.sessionID);
    setTimeout(() => {
        savePopup.fadeOut(500);
    }, 1000);
    clearInterval(failedSave);
}
export function renderPreview(renderer) {
    let iframe = document.getElementById("preview-frame");
    iframe.srcdoc = `
    <html>
        <head>
            <link rel="stylesheet" href="./userPreviewStyle.css">
        </head>
        <body>
            <div id="story-content-preview">${renderer.story.currentNode.content}</div>
        </body>
    </html>`;
}
export function switchTabView(tabViewIsEditor, playerView, editorView) {
    if (tabViewIsEditor) {
        playerView.show();
        editorView.hide();
        return false;
    }
    else {
        playerView.hide();
        editorView.show();
        return true;
    }
}
function lastCharIsNum(string) {
    return parseInt(string.charAt(string.length - 1)) != NaN;
}

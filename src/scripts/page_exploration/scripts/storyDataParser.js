



function writeStoryContent(pageInstances) {
    let saveFile = {}

    for( let i=0; i< pageInstances.length; i++) {
        let current = pageInstances
        if (current._pages != undefined) {
            saveFile = parseSequence(current, saveFile)
        } else if (current._text != undefined) {
            saveFile = parseStoryNode(current, saveFile)
        }
    }
    fs.writeFileSync("./keeper-of-the-labyrinth.json", JSON.stringify(saveFile))
}

function parseSequence(sequenceInstance, saveFile) {
    for (let page=0; page < sequenceInstance._pages.length; page++) {
        let title = sequenceInstance.title + page
        let content = sequenceInstance._pages[page]
        let optionText = sequenceInstance._buttons[page]
        let destination;
        if (page == sequenceInstance.pages.length - 1) {
            destination = sequenceInstance._next
        } else {
            destination = sequenceInstance.title + (page + 1)
        }
        saveFile[title] = {
            content: content,
            options: [{
                text: optionText,
                destination: destination
            }]
        }
    }
    return saveFile
}

function parseStoryNode(nodeInstance, saveFile) {
    saveFile[nodeInstance.title] = {
        content: nodeInstance._text,
        options: []
    }
    for (let option = 0; option < nodeInstance._buttons.length; option++) {
        saveFile[nodeInstance.title].options.push({
            text: nodeInstance._buttons[option][0],
            destination: nodeInstance._buttons[option][1].title
        })
    }
    return saveFile
}
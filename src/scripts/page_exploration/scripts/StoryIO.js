import { Story, StoryNode } from "./Story.js";
import { StoryOption } from "./StoryOption.js";
const fs = require("fs");
export function readStoryData(filename) {
    let story = new Story();
    let storyData = JSON.parse(fs.readFileSync("./story_data/" + filename + ".json"));
    console.log(storyData);
    let nodes = Object.keys(storyData);
    for (let i = 0; i < nodes.length; i++) {
        let title = nodes[i];
        let currentNodeData = storyData[title];
        let { content, options } = currentNodeData;
        let node = new StoryNode(content);
        node = story.addNode(title, node);
        for (let j = 0; j < options.length; j++) {
            let option = createOptionFromRead(story, options[j]);
            story.addOption(node, option);
        }
    }
    return story;
}
function createOptionFromRead(story, optionData) {
    let { text, destination, disabled, conditions } = optionData;
    let destinationNode = story.node(destination);
    if (destinationNode == undefined) {
        destinationNode = new StoryNode();
        story.addNode(destination, destinationNode);
    }
    let isConditional = conditions ? true : false;
    let isDefaultDisabled = disabled ? true : false;
    return new StoryOption(text, destinationNode, isDefaultDisabled, isConditional, conditions === null || conditions === void 0 ? void 0 : conditions.storyNodeDependencies, conditions === null || conditions === void 0 ? void 0 : conditions.scoreDependencies);
}
export function writeStoryData(story, sessionID) {
    let save = {};
    let backup = "./story_data/" + "auto" + sessionID + ".json";
    let filename = "./story_data/" + sessionID.split('-')[0] + ".json";
    story.forEachNode((node, title) => {
        save[title] = {
            "content": node.content,
            "options": []
        };
        story.options(node).forEach((option) => {
            let optionData = {
                "text": option.text,
                "destination": story.title(option.destination),
                "disabled": option.isDefaultDisabled
            };
            if (option.isConditional) {
                optionData["conditions"] = {
                    "isScoreThresholdDependant": option.conditions.isScoreThresholdDependant,
                    "isVisitedNodesDependant": option.conditions.isVisitedNodesDependant,
                    "scoreDependencies": [],
                    "nodeDependencies": []
                };
                fillOptionDataDependencies(option, optionData);
            }
            save[title].options.push(optionData);
        });
    });
    fs.access(filename, (error) => {
        if (!error) {
            fs.writeFileSync(backup, fs.readFileSync(filename));
        }
        fs.writeFileSync(filename, JSON.stringify(save));
    });
}
function fillOptionDataDependencies(option, optionData) {
    if (option.conditions.isScoreThresholdDependant) {
        if (option.conditions.isVisitedNodesDependant) {
            fillScoreDependencies(option, optionData);
            fillNodeDependencies(option, optionData);
        }
        else {
            fillScoreDependencies(option, optionData);
        }
    }
    else if (option.conditions.isVisitedNodesDependant) {
        fillNodeDependencies(option, optionData);
    }
}
function fillNodeDependencies(option, optionData) {
    option.conditions.nodeDependencies.forEach((dependencyRule) => {
        optionData["conditions"].nodeDependencies.push(dependencyRule.dependencyData);
    });
}
function fillScoreDependencies(option, optionData) {
    option.conditions.scoreDependencies.forEach((dependencyRule) => {
        optionData["conditions"].scoreDependencies.push(dependencyRule.dependencyData);
    });
}

import { StoryOption } from "./StoryOption.js";
function unsetTraversalEffects() {
    return {
        image: false,
        imageURL: "",
        persistentImage: false,
        music: false,
        musicURL: "",
        musicEffects: { fadeIn: false, fadeInTime: 0, fadeOut: false, fadeOutTime: 0 },
        scoreChanges: []
    };
}
export class StoryNode {
    constructor(content, traversalEffects) {
        this.content = content ? content : '';
        this.traversalEffects = traversalEffects ? traversalEffects : unsetTraversalEffects();
    }
}
export class Story {
    constructor() {
        this.nodes = new Map();
        this.titles = new Map();
        this.ancestralEdgeMap = new Map();
        this.ancestralAdjacencyMap = new Map();
        this.adjacencyMap = new Map();
        this.edgeMap = new Map();
        this.addNode('root', new StoryNode());
        this.setCurrent(this.nodes.get('root'));
    }
    /**
     * Checks whether the specified node or node title exists in the story.
    */
    has(node) {
        if (node instanceof StoryNode) {
            return this.adjacencyMap.get(node) != undefined;
        }
        else {
            return this.nodes.get(node) != undefined;
        }
    }
    node(nodeTitle) {
        return this.nodes.get(nodeTitle);
    }
    title(node) {
        return this.titles.get(node);
    }
    adjacencies(node) {
        return this.adjacencyMap.get(node);
    }
    ancestralAdjacencies(node) {
        return this.ancestralAdjacencyMap.get(node);
    }
    options(node) {
        return this.edgeMap.get(node);
    }
    /**
     * Initialize a new StoryNode instance and add it to this Story.
    */
    createNode(title, content) {
        return this.addNode(title, new StoryNode(content));
    }
    /**
     * Add the given StoryNode to this story.
     * @param title a name to be used to reference the node later.
     * @param node the StoryNode to add.
     * @param options a set of StoryOptions to attach to the Node.
     * @example
     *  let story = new Story()
     *  story.addNode("node1", new StoryNode())
     * //A new, empty node is placed in the story.
     *  story.addNode("node1", new StoryNode("some content"))
    */
    addNode(title, node, options) {
        if (this.has(title)) {
            this.resetExistingNode(node, title);
        }
        else {
            this.setupNewNode(node, title);
        }
        if (options) {
            this.setupGivenOptions(node, options);
        }
        else {
            this.setupBlankOptions(node);
        }
        return this.node(title);
    }
    setupNewNode(node, title) {
        this.nodes.set(title, node);
        this.titles.set(node, title);
        this.adjacencyMap.set(node, new Set());
        this.ancestralAdjacencyMap.set(node, new Set());
    }
    resetExistingNode(node, title) {
        this.node(title).content = node.content;
    }
    setupGivenOptions(node, options) {
        this.edgeMap.set(node, options);
        options.forEach((option) => {
            this.adjacencies(node).add(option.destination);
            this.ancestralAdjacencies(option.destination).add(node);
        });
    }
    setupBlankOptions(node) {
        this.edgeMap.set(node, new Set());
    }
    /**
     * Removes a node from the story, clearing it from all adjacency maps and removing options leading to it as well.
    */
    removeNode(node) {
        if (this.has(node)) {
            let title = this.title(node);
            this.detachNodeFromChildren(node);
            this.detachNodeFromAncestors(node);
            this.nodes.delete(title);
            this.titles.delete(node);
        }
    }
    /**
     * Iterates through all ancestors of the given node and removes node from their adjacencies,
     * and removes options leading to node.
    */
    detachNodeFromAncestors(node) {
        this.ancestralAdjacencies(node).forEach((parentNode) => {
            this.adjacencies(parentNode).delete(node);
            this.clearOptionsLeadingToNode(parentNode, node);
        });
    }
    /**
     * Iterates over children and removes given node from their ancestors map,
     * then removes all options on node.
    */
    detachNodeFromChildren(node) {
        this.adjacencies(node).forEach((childNode) => {
            this.ancestralAdjacencies(childNode).delete(node);
        });
        this.options(node).clear();
    }
    /**
     * Removes all options from the origin which point to destination.
    */
    clearOptionsLeadingToNode(origin, destination) {
        this.options(origin).forEach((option, same, set) => {
            if (option.destination == destination) {
                set.delete(option);
            }
        });
    }
    /**
     * Initialize a new empty StoryOption linking origin to destination.
    */
    link(origin, destination) {
        this.addOption(origin, new StoryOption('', destination));
    }
    /**
     * Add the given option to the node, and update adjacency maps
     * to reflect the origin node and destination's adjacency.
    */
    addOption(node, option) {
        this.adjacencies(node).add(option.destination);
        this.ancestralAdjacencies(option.destination).add(node);
        this.options(node).add(option);
    }
    removeOption(node, option) {
        this.adjacencies(node).delete(option.destination);
        this.ancestralAdjacencies(option.destination).delete(node);
        this.options(node).delete(option);
    }
    traverse(option) {
        let optionMap = this.options(this.currentNode);
        if (optionMap.has(option)) {
            this.currentNode = option.destination;
        }
        return this.currentNode;
    }
    setCurrent(node) {
        if (this.has(node)) {
            this.currentNode = node;
        }
    }
    /**
     * Callback recieves (node, title, nodeMap).
    */
    forEachNode(callback, returnVariable) {
        return this.nodes.forEach(callback, returnVariable);
    }
    get emptyNodes() {
        let emptyNodes = [];
        this.forEachNode((node) => {
            if (node.content == '') {
                emptyNodes.push(this.title(node));
            }
        }, emptyNodes);
        return emptyNodes;
    }
    get disconnectedNodes() {
        let disconnectedNodes = [];
        this.forEachNode((node) => {
            if (this.adjacencies(node).size == 0) {
                if (this.ancestralAdjacencies(node).size == 0) {
                    disconnectedNodes.push(this.title(node));
                }
            }
        }, disconnectedNodes);
        return disconnectedNodes;
    }
}

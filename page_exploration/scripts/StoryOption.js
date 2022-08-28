export class StoryOption {
    constructor(text, destination, isDefaultDisabled, isConditional, nodeDependencies, scoreDependencies) {
        this.isDefaultDisabled = false;
        this.text = '';
        this.text = text;
        this.destination = destination;
        this.isDefaultDisabled = isDefaultDisabled ? isDefaultDisabled : false;
        this.isConditional = isConditional ? isConditional : false;
        if (this.isConditional) {
            if (nodeDependencies) {
                this.conditions.isVisitedNodesDependant = true;
                this.conditions.nodeDependencies = new Set();
                nodeDependencies.forEach((dependencyRuleData) => {
                    this.conditions.nodeDependencies.add(new NodeDependencyRule(dependencyRuleData));
                });
            }
            if (scoreDependencies) {
                this.conditions.isScoreThresholdDependant = true;
                this.conditions.scoreDependencies = new Set();
                scoreDependencies.forEach((dependencyRuleData) => {
                    this.conditions.scoreDependencies.add(new ScoreDependencyRule(dependencyRuleData));
                });
            }
        }
        this.optionID = "OPT" + (Math.floor(Math.random() * 100) + Date.now());
    }
    addNodeDependencyRule() {
    }
    addScoreDependencyRule() {
    }
    clearDependencyRules() {
    }
    setDisabled(value) {
        this.isDefaultDisabled = true;
    }
    isDisabled(visitedNodes) {
        if (this.isDefaultDisabled) {
            return true;
        }
        else {
            return this.computeDisabledValue(visitedNodes);
        }
    }
    /**
     * Computes how the "disabled" flag should be set depending on the internal logic set by the writer.
     * Disabled value determines whether the option should be shown to the player on the node to which it is linked.
     * If an option's "disabled" flag is set to true, it will not be shown.
     * Options may be disabled by three factors.
     * 1. May be flagged as permanently disabled for development purposes.
     * 2. May be dependant on the presence of certain StoryNodes in the player's visitedNodes history.
     * 3. May be dependant on the values of certain scores incremented by writer-set StoryNode Effects.
    */
    computeDisabledValue(visitedNodes) {
        if (this.isConditional) {
            let c = this.conditions;
            if (c.isScoreThresholdDependant) {
                if (c.isVisitedNodesDependant) {
                    return !this.fulfillsNodeDependencies(visitedNodes) || !this.fulfillsScoreThresholds(visitedNodes);
                }
                else {
                    return !this.fulfillsScoreThresholds(visitedNodes);
                }
            }
            else if (c.isVisitedNodesDependant) {
                return !this.fulfillsNodeDependencies(visitedNodes);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    fulfillsNodeDependencies(visitedNodes) {
        return this.isFulfilled("nodeDependencies", visitedNodes);
    }
    fulfillsScoreThresholds(visitedNodes) {
        return this.isFulfilled("scoreDependencies", visitedNodes);
    }
    /**
     * Iterates over the set of dependency rules of the given type for this node.
     * @returns a boolean value representing the universal quantification of all rules of the given type.
    */
    isFulfilled(dependencyType, visitedNodes) {
        let fulfilled = true;
        let data;
        if (dependencyType == "scoreDependencies") {
            data = this.generateScoresList(visitedNodes);
        }
        else {
            data = visitedNodes;
        }
        fulfilled = this.conditions[dependencyType].forEach((dependencyRule) => {
            return fulfilled && dependencyRule.isFulfilled(data);
        });
        return fulfilled;
    }
    generateScoresList(visitedNodes) {
        //TODO
    }
}
export class ScoreDependencyRule {
    constructor(dependencyData) {
        this.dependencyData = dependencyData;
        this.isFulfilled = this.generateFulfillmentChecker(dependencyData);
    }
    generateFulfillmentChecker(dependencyData) {
        let { scores, comparators, values, connectives } = dependencyData;
        let fulfillmentChecker = this.generateScoreComparator(scores[0], comparators[0], values[0]);
        for (let i = 1; i < scores.length; i++) {
            let last = fulfillmentChecker;
            let connective = connectives[i];
            let next = this.generateScoreComparator(scores[i], comparators[i], values[i]);
            fulfillmentChecker = this.logicalConnect(last, connective, next);
        }
        return fulfillmentChecker;
    }
    generateScoreComparator(score, comparator, number) {
        switch (comparator) {
            case "eq": return (list) => { return list[score] == number; };
            case "gt": return (list) => { return list[score] > number; };
            case "lt": return (list) => { return list[score] < number; };
            case "geq": return (list) => { return list[score] >= number; };
            case "leq": return (list) => { return list[score] <= number; };
        }
    }
    /**
     * Creates a function representing the joining of two boolean-returning functions with a logical connective.
    */
    logicalConnect(last, connective, next) {
        switch (connective) {
            case "and": return (list) => { return last(list) && next(list); };
            case "or": return (list) => { return last(list) || next(list); };
        }
    }
}
export class NodeDependencyRule {
    constructor(dependencyData) {
        this.dependencyData = dependencyData;
        this.isFulfilled = this.generateFulfillmentChecker(dependencyData);
    }
    /**
     * Generates a function to determine whether the StoryNode dependencies are fulfilled
     * based on the player's array of previously visited node titles. This function is created dynamically depending
     * on what logic the writer has set in the node dependency data.
    */
    generateFulfillmentChecker(dependencyData) {
        let fulfillmentChecker = (v) => { return v.has(dependencyData.nodes[0]); };
        for (let i = 1; i < dependencyData.nodes.length; i++) {
            let last = fulfillmentChecker;
            let next = (v) => { return v.has(dependencyData.nodes[i]); };
            let connective = dependencyData.connectives[i];
            fulfillmentChecker = this.logicalConnect(last, connective, next);
        }
        return (visited) => { return dependencyData.read && fulfillmentChecker(visited); };
    }
    /**
     * Creates a function representing the joining of two boolean-returning functions with a logical connective.
    */
    logicalConnect(last, connective, next) {
        switch (connective) {
            case "and": return (v) => { return last(v) && next(v); };
            case "or": return (v) => { return last(v) || next(v); };
        }
    }
}

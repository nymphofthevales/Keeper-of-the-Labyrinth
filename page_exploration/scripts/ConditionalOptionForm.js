import { DynamicElement } from "./dynamicElement.js";
import { Form } from "./form.js";
export class ConditionalOptionForm {
    constructor(story, option) {
        this.structure = {
            formVisibilitySelectors: {
                "check-isconditional": undefined,
                "check-showif": undefined,
                "check-showif-visited": undefined,
                "check-showif-scored": undefined,
                "check-hideif": undefined,
                "check-hideif-visited": undefined,
                "check-hideif-scored": undefined
            },
            addRules: {
                "showif-visited-addrule": undefined,
                "showif-scored-addrule": undefined,
                "hideif-visited-addrule": undefined,
                "hideif-scored-addrule": undefined
            },
            contentContainers: {
                "content-container": undefined,
                "showHideForm-content-container": undefined,
                "showif-visitedScoredForm-content-container": undefined,
                "showif-visited-rulesForm-content-container": undefined,
                "showif-scored-rulesForm-content-container": undefined,
                "hideif-visitedScoredForm-content-container": undefined,
                "hideif-visited-rulesForm-content-container": undefined,
                "hideif-scored-rulesForm-content-container": undefined
            }
        };
        this.dependencyRules = {
            "showif-visited": [],
            "showif-scored": [],
            "hideif-visited": [],
            "hideif-scored": []
        };
        this.story = story;
        this.option = option;
    }
    anchorTo(destination) {
        if (this.existsInDocument) {
            this.mainContentContainer.remove();
        }
        destination.appendChild(this.createDOMNode());
        this.createEventListeners();
        this.setDefaultState();
    }
    fillStructure() {
        if (this.existsInDocument) {
            Object.keys(this.structure).forEach((sectionname) => {
                let section = this.structure[sectionname];
                Object.keys(section).forEach((id) => {
                    let longId = this.createElementId(id);
                    //console.log(longId)
                    if (sectionname != "contentContainers") {
                        section[id] = document.getElementById(longId);
                    }
                    else {
                        section[id] = new DynamicElement(longId);
                    }
                });
            });
        }
    }
    setDefaultState() {
        if (this.option.isConditional) {
            this.setStateFromOption();
        }
        else {
            this.setEmptyState();
        }
        this.resolveValueVisibilityDeltas();
    }
    toggleCheck(checkbox) {
        checkbox.checked = !checkbox.checked;
        this.fireChange(checkbox);
    }
    check(checkbox) {
        checkbox.checked = true;
        this.fireChange(checkbox);
    }
    uncheck(checkbox) {
        checkbox.checked = false;
        this.fireChange(checkbox);
    }
    fireChange(element) {
        let change = new Event("change");
        element.dispatchEvent(change);
    }
    setEmptyState() {
        Object.values(this.structure.formVisibilitySelectors).forEach((element) => {
            this.uncheck(element);
        });
    }
    setStateFromOption() {
        let isConditionalCheckbox = this.structure.formVisibilitySelectors["check-isconditional"];
        this.setEmptyState();
        this.check(isConditionalCheckbox);
        if (this.option.conditions.isVisitedNodesDependant) {
            let showifVisitedCheckbox = this.structure.formVisibilitySelectors["check-showif-visited"];
            this.check(showifVisitedCheckbox);
            this.option.conditions.nodeDependencies.forEach((nodeDependencyRule) => {
                this.addNodeRuleFromData(nodeDependencyRule);
            });
        }
        if (this.option.conditions.isScoreThresholdDependant) {
            let showifScoredCheckbox = this.structure.formVisibilitySelectors["check-showif-scored"];
            this.check(showifScoredCheckbox);
            this.option.conditions.scoreDependencies.forEach((scoreDependencyRule) => {
                this.addScoreRuleFromData(scoreDependencyRule);
            });
        }
    }
    addNodeRuleFromData(dependencyRule) {
        let form = this.addRule("showif-visited");
        let data = dependencyRule.dependencyData;
        form.set(data);
    }
    addScoreRuleFromData(dependencyRule) {
        dependencyRule.dependencyData;
        //TODO
    }
    readFormToNodeDependencyData() {
        //TODO
    }
    readFormToScoreDependencyData() {
        //TODO
    }
    /**
     * Possible dependencyNames:
     * showif-visited
     * showif-scored
     * hideif-visited
     * hideif-scored
    */
    addRule(dependencyName) {
        let target = document.getElementById(this.createElementId(`${dependencyName}-rules-container`));
        console.log(this.createElementId(`${dependencyName}-rules-container`));
        let form = new NodeDependencyRuleForm(this.option, target);
        this.dependencyRules[dependencyName].push(form);
        return form;
    }
    /**
     * Ensures any checked boxes in the form have their corresponding section shown, as well as unchecked hidden.
    */
    resolveValueVisibilityDeltas() {
        Object.entries(this.structure.formVisibilitySelectors).forEach(([id, element]) => {
            let container = this.getCorrespondingContainer(id);
            let ref = container.reference;
            let isHidden = ref.classList.contains("hidden");
            if (element.checked != !isHidden) {
                if (element.checked) {
                    container.show();
                }
                else {
                    container.hide();
                }
            }
        });
    }
    getCorrespondingContainer(selectorName) {
        return this.structure.contentContainers[this.getCorrespondingContainerKey(selectorName)];
    }
    getCorrespondingContainerKey(selectorName) {
        return this.getCorrespondingContainerName(selectorName) + "-content-container";
    }
    getCorrespondingContainerName(selectorName) {
        let identifiers = selectorName.split("-");
        let name = identifiers[1];
        if (identifiers.length > 2) {
            name += "-" + identifiers[2];
        }
        switch (name) {
            case "isconditional": return "showHideForm";
            case "showif": return "showif-visitedScoredForm";
            case "showif-visited": return "showif-visited-rulesForm";
            case "showif-scored": return "showif-scored-rulesForm";
            case "hideif": return "hideif-visitedScoredForm";
            case "hideif-visited": return "hideif-visited-rulesForm";
            case "hideif-scored": return "hideif-scored-rulesForm";
        }
    }
    createEventListeners() {
        this.fillStructure();
        //console.log(this.structure)
        this.createVisibilitySelectorListeners();
        this.createAddRuleListeners();
    }
    createVisibilitySelectorListeners() {
        Object.entries(this.structure.formVisibilitySelectors).forEach(([selectorName, element]) => {
            let containerKey = this.getCorrespondingContainerKey(selectorName);
            let containerDynamicElement = this.structure.contentContainers[containerKey];
            if (containerDynamicElement == undefined) {
                console.log(containerKey + "  " + selectorName);
            }
            element.addEventListener("change", () => {
                containerDynamicElement.toggleVisibility();
            });
        });
    }
    createAddRuleListeners() {
        Object.entries(this.structure.addRules).forEach(([id, element]) => {
            let dependencyName = this.generateDependencyNameFromButtonId(id);
            element.addEventListener("click", () => {
                this.addRule(dependencyName);
            });
        });
    }
    /**
     * Converts e.g. "showif-scored-rulesform-..." to "showif-scored"
    */
    generateDependencyNameFromButtonId(id) {
        let parts = id.split("-");
        let name = parts[0] + "-" + parts[1];
        return name;
    }
    get existsInDocument() {
        return !!this.mainContentContainer;
    }
    get mainContentContainer() {
        return document.getElementById(this.createElementId(`form` + `-content-container`));
    }
    createDOMNode() {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = this.generateConditionalOptionHTML();
        return wrapper.firstChild;
    }
    createElementId(elementID) {
        return `conditional-option-` + this.option.optionID + '-' + elementID;
    }
    /**
     * Contains:
     *
    */
    generateConditionalOptionHTML() {
        let baseID = this.createElementId(``);
        let destinationTitle = this.story.title(this.option.destination);
        let optionText = this.option.text.length < 25 ? this.option.text : this.option.text.slice(0, 25);
        return this.wrapperDiv(baseID + `form` + `-content-container`, false, this.showHideForm(baseID, this.isConditionalCheckbox(baseID, optionText, destinationTitle) +
            this.wrapperDiv(baseID + `showHideForm` + `-content-container`, false, this.showIfForm(baseID, this.showIfCheckbox(baseID) +
                this.wrapperDiv(baseID + `showif-visitedScoredForm` + `-content-container`, false, this.showIfVisitedRulesForm(baseID, this.showIfVisitedCheckbox(baseID) +
                    this.wrapperDiv(baseID + `showif-visited-rulesForm` + `-content-container`, false, this.rulesFormContent(baseID, "show", "visited"))) +
                    this.showIfScoredRulesForm(baseID, this.showIfScoredCheckbox(baseID) +
                        this.wrapperDiv(baseID + `showif-scored-rulesForm` + `-content-container`, true, this.rulesFormContent(baseID, "show", "scored"))))) +
                this.hideIfForm(baseID, this.hideIfCheckbox(baseID) +
                    this.wrapperDiv(baseID + `hideif-visitedScoredForm` + `-content-container`, true, this.hideIfVisitedRulesForm(baseID, this.hideIfVisitedCheckbox(baseID) +
                        this.wrapperDiv(baseID + `hideif-visited-rulesForm` + `-content-container`, true, this.rulesFormContent(baseID, "hide", "visited"))) +
                        this.hideIfScoredRulesForm(baseID, this.hideIfScoredCheckbox(baseID) +
                            this.wrapperDiv(baseID + `hideif-scored-rulesForm` + `-content-container`, true, this.rulesFormContent(baseID, "hide", "scored"))))))));
    }
    wrapperDiv(id, hidden, form) {
        let classList = hidden ? `hidden` : ``;
        return `<div id="${id}" class="${classList}">` + form + `</div>`;
    }
    /**
     * ID: baseID + "check"
    */
    isConditionalCheckbox(baseID, optionText, destinationTitle) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-isconditional"> "${optionText}" => <i>${destinationTitle}</i>
        </legend>
        `;
    }
    showIfCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-showif">Show if...</input>
        </legend>
        `;
    }
    hideIfCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-hideif">Hide if...</input>
        </legend>
        `;
    }
    showIfVisitedCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-showif-visited">Visited nodes</input>
        </legend>
        `;
    }
    showIfScoredCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-showif-scored">Scored</input>
        </legend>
        `;
    }
    hideIfVisitedCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-hideif-visited">Visited nodes</input>
        </legend>
        `;
    }
    hideIfScoredCheckbox(baseID) {
        return `
        <legend>
            <input type="checkbox" id="${baseID}check-hideif-scored">Scored</input>
        </legend>
        `;
    }
    /**
     * fieldset with ID "-form-show-hide"
    */
    showHideForm(baseID, content) {
        return `
        <fieldset id="${baseID}form-show-hide" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-showif-visited-scored"
    */
    showIfForm(baseID, content) {
        return `
        <fieldset id="${baseID}showif-visited-scored" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-hideif-visited-scored"
    */
    hideIfForm(baseID, content) {
        return `
        <fieldset id="${baseID}form-hideif-visited-scored" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-showif-visited-rules"
    */
    showIfVisitedRulesForm(baseID, content) {
        return `
        <fieldset id="${baseID}showif-visited-rules" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-showif-scored-rules"
    */
    showIfScoredRulesForm(baseID, content) {
        return `
        <fieldset id="${baseID}showif-scored-rules" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-hideif-visited-rules"
    */
    hideIfVisitedRulesForm(baseID, content) {
        return `<fieldset id="${baseID}hideif-visited-rules" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    /**
     * fieldset with ID "-hideif-scored-rules"
    */
    hideIfScoredRulesForm(baseID, content) {
        return `<fieldset id="${baseID}hideif-scored-rules" class="conditional-form">` +
            content +
            `</fieldset>`;
    }
    rulesFormContent(baseID, visibilityType, ruleType) {
        let buttonText;
        switch (ruleType) {
            case "visited":
                buttonText = "ADD NODE VISITATION RULE";
                break;
            case "scored": buttonText = "ADD SCORING RULE";
        }
        return `
        <p>Reader must have:<p>
        <div id="${baseID}${visibilityType}if-${ruleType}-rules-container"></div>
        <button id="${baseID}${visibilityType}if-${ruleType}-addrule" class="uibutton">${buttonText}</button>
        `;
    }
    generateConditionalOptionScoredRuleFormHTML() {
        //VERY TEMP
        `<form id="conditional-option-${this.option.optionID}-scored-rule-${Date.now()}">`;
    }
}
class ScoreDependencyRuleForm {
}
class NodeDependencyRuleForm {
    constructor(option, target) {
        console.log(target);
        this.option = option;
        this.nodes = 0;
        this.baseID = `conditional-option-${this.option.optionID}-visited-rule-${Date.now()}`;
        this.parentContainer = target;
        this.anchorTo(target);
        this.container = document.getElementById(this.baseID + "-container");
        this.inputs = new Form(this.container);
        this.trackInputs();
    }
    anchorTo(target) {
        if (!!document.getElementById(this.baseID + "-container")) {
            this.removeFromDocument();
        }
        let containerNode = this.createDOMNode();
        console.log(containerNode);
        target.appendChild(containerNode);
    }
    trackInputs() {
        this.setupNewAddNodeButton();
        this.inputs.addInput("node-0", this.baseID + "-node-0");
        this.inputs.addInput("read", this.baseID + "-read");
        let removeButton = document.getElementById(`${this.baseID}-remove`);
        console.log(removeButton);
        removeButton.addEventListener("mouseup", () => {
            this.removeFromDocument();
            console.log(`removing....`);
            //...? TODO remove from document... should be removed from conditionaloptionform 
            //dependencyRules as well, thereby destroying all reference to the form.
        });
    }
    read() {
        let formData = this.inputs.read();
        let nodeDependencyData = {
            read: Boolean(formData.read),
            nodes: [],
            connectives: []
        };
        for (let i = 1; i <= this.nodes; i++) {
            nodeDependencyData.connectives.push(formData[`connective-${i}`]);
        }
        for (let i = 0; i <= this.nodes; i++) {
            nodeDependencyData.nodes.push(formData[`node-${i}`]);
        }
        return nodeDependencyData;
    }
    set(data) {
        this.reset();
        this.inputs.get("read").value = `${data["read"]}`;
        this.inputs.get("node-0").value = data.nodes[0];
        for (let i = 1; i < data.nodes.length; i++) {
            this.addNodeToForm();
            this.inputs.get(`connective-${i}`).value = data.connectives[i];
            this.inputs.get(`node-${i}`).value = data.nodes[i];
        }
    }
    reset() {
        if (this.nodes > 0) {
            this.anchorTo(this.parentContainer);
        }
    }
    removeFromDocument() {
        this.container.remove();
        console.log(`removed`);
    }
    createDOMNode() {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = this.generateFormHTML();
        return wrapper.firstChild;
    }
    generateFormHTML() {
        return `<form id="${this.baseID}-container" class="conditional-option-rule-form" action="javascript:void(0);">
            <button id="${this.baseID}-remove" class="action-button">—</button>
            <select id="${this.baseID}-read">
                <option value="true" selected>Read</option>
                <option value="false">Not read</option>
            </select>
            <input type="text" id="${this.baseID}-node-0" value="">
        </form>
        `;
    }
    generateAddNodeButtonHTML() {
        return `<button id="${this.baseID}-addNode" class="action-button">...</button>`;
    }
    generateAdditionalNodeHTML(number) {
        return `
        <select id="${this.baseID}-connective-${number}">
            <option value="or" selected>or</option> 
            <option value="and">and</option>
        </select>
        <input type="text" id="${this.baseID}-node-${number}">
        `;
    }
    addNodeToForm() {
        this.nodes += 1;
        this.removeAddNodeButton();
        this.container.innerHTML += this.generateAdditionalNodeHTML(this.nodes);
        this.setupNewAddNodeButton();
        this.trackNewNodeInputs();
    }
    trackNewNodeInputs() {
        let connectiveId = `connective-${this.nodes}`;
        let nodeEntryId = `node-${this.nodes}`;
        this.inputs.addInput(connectiveId, this.baseID + `-` + connectiveId);
        this.inputs.addInput(nodeEntryId, this.baseID + `-` + nodeEntryId);
    }
    removeAddNodeButton() {
        let addNodeButton = document.getElementById(this.baseID + "-addNode");
        addNodeButton.remove();
    }
    setupNewAddNodeButton() {
        //TODO use DOM appendchild(Node) instead of += to avoid destroying listeners
        this.container.innerHTML += this.generateAddNodeButtonHTML();
        let addNodeButton = document.getElementById(this.baseID + "-addNode");
        addNodeButton.addEventListener("click", () => {
            this.addNodeToForm();
        });
    }
}

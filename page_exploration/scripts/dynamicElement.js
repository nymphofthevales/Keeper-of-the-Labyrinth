export class DynamicElement {
    constructor(element) {
        if (typeof element == "string") {
            this.reference = document.getElementById(element);
        }
        else {
            this.reference = element;
        }
    }
    toggleVisibility() {
        if (this.reference.classList.contains("hidden")) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    hide() {
        this.reference.classList.add('hidden');
    }
    show() {
        this.reference.classList.remove("hidden");
    }
    fadeOut(ms) {
        setTimeout(() => {
            this.hide();
            this.reference.style.animation = ``;
        }, ms);
        this.reference.style.animation = `dynamicElementFadeOut ${ms / 1000}s`;
    }
    fadeIn(ms) {
        setTimeout(() => {
            this.show();
            this.reference.style.animation = ``;
        }, ms);
        this.reference.style.animation = `dynamicElementFadeIn ${ms / 1000}s`;
    }
    clear() {
        this.reference.innerHTML = "";
    }
    blur() {
        this.reference.blur();
    }
    /**
     * Sets the background of an element. Automatically includes css url() wrapper.
    */
    set background(imageUrl) {
        this.reference.style.backgroundImage = `url(\'${imageUrl}\')`;
    }
}

export class LocalEventManager {
    constructor() {
        this.events = {};
    }
    addEvent(event, eventOpts) {
        this.events[event] = new LocalEvent(eventOpts);
    }
    onEvent(eventName, callback) {
        let event = this.events[eventName];
        if (!event) {
            this.events[eventName] = new LocalEvent();
        }
        event.addListener(callback);
    }
    emit(event) {
        var _a;
        (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.emit();
    }
    get(event) {
        return this.events[event];
    }
}
export class LocalEvent {
    constructor(options) {
        this.options = options ? options : {};
        this.listeners = [];
    }
    emit() {
        this.listeners.forEach((listener, index) => {
            listener(this.options);
        });
    }
    addListener(callback) {
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
    }
    setOption(key, value) {
        this.options[key] = value;
    }
}

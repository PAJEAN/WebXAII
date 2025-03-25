export class PubSub {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        return () => {
            const index = this.events[event].indexOf(callback);
            this.events[event].splice(index, 1);
        };
    }

    publish(event, data = {}) {
        if (!this.events.hasOwnProperty(event)) {
            return [];
        }

        return this.events[event].map(callback => callback(data));
    }
}
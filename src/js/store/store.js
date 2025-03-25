import { PubSub } from 'JS/lib/pubsub.js';

export class Store {
    constructor(params) {
        this.state = {};
        this.actions = {};
        this.mutations = {};
        this.status = 'resting';
        this.events = new PubSub();

        if (params.hasOwnProperty('actions')) {
            this.actions = params.actions;
        }
        if (params.hasOwnProperty('mutations')) {
            this.mutations = params.mutations;
        }

        this.state = new Proxy((params.state || {}), {
            set: (state, key, value) => {
                state[key] = value;
                console.log(`stateChange: ${this.status}`);

                this.events.publish('stateChange', this.state);

                if (this.status !== 'mutation') {
                    console.warn(`You should use a mutation to set ${key}`);
                }

                this.status = 'resting';
                return true;
            },
            get: params.hasOwnProperty('getters')
                ? (state, key) => key in params.getters ? params.getters[key](state) : state[key]
                : (state, key) => state[key]
        });
    }

    /* Call actions to run mutations */
    dispatch(action_key, payload) {
        if (typeof this.actions[action_key] !== 'function') {
            console.error(`dispatch(): Action ${action_key} doesn't exist`);
            return Promise.reject();
        }

        this.status = 'action';
        let result = this.actions[action_key](this, payload);

        return result instanceof Promise ? result : Promise.resolve(result);
    }

    /* Call mutations */
    commit(mutation_key, payload) {
        if (typeof this.mutations[mutation_key] !== 'function') {
            console.error(`commit(): Mutation ${mutation_key} doesn't exist`);
            return false;
        }

        this.status = 'mutation';
        this.mutations[mutation_key](this.state, payload);
        return true;
    }
}
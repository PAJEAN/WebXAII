import { Store } from './store.js';
/* Modules */
import { module as common } from 'JS/store/modules/common';
import { module as task } from 'JS/store/modules/task';

export const store = new Store({
    'actions': Object.assign(common.actions, task.actions), // Object.assign(cible, ...sources).
    'mutations': Object.assign(common.mutations, task.mutations),
    'getters': Object.assign(common.getters, task.getters),
    'state': Object.assign(common.state, task.state)
});
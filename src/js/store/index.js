import { Store } from './store.js';
/* Modules */
import { module as common } from 'JS/store/modules/common';
import { module as preferences } from 'JS/store/modules/preferences';

export const store = new Store({
    'actions': Object.assign(common.actions, preferences.actions), // Object.assign(cible, ...sources).
    'mutations': Object.assign(common.mutations, preferences.mutations),
    'getters': Object.assign(common.getters, preferences.getters),
    'state': Object.assign(common.state, preferences.state)
});
// @ts-check

/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

function getCurrentViewType() {
    let current_view = store.state[keys.g_current_view];
    
    if (!current_view) {
        return undefined;
    }
    
    return current_view['type'];
}

export function changePage() {
    let view_type = getCurrentViewType();

    console.log(store.state[keys.s_current_view_index]);
    
    if (!view_type) {
        // Page 404.
        return;
    }
    
    console.log('VIEW TYPE: ' + view_type);

    window.location.hash = '';

    switch(view_type) {
        case PAGE_NAMES.TASK:
            window.location.hash = '#/task';
            break;
        case PAGE_NAMES.TEXT:
            window.location.hash = '#/text';
            break;
        case PAGE_NAMES.TEST:
            window.location.hash = '#/test';
            break;
    }
}

export function nextView() {
    store.dispatch(keys.a_update_view_index, {}); // Authentication is the first page.
    changePage();
}

/**
 * 
 * @param {string} expected_view 
 */
export function guardView(expected_view) {
    let view_type = getCurrentViewType();
    if (view_type != expected_view) {
        changePage();
    }
}

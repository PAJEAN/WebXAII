// @ts-check

/* Lib */
import { keys as keys_router, Router } from './router';
/* Namespaces */
import { PAGE_NAMES, PAGES_INFO } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
/* Utils */
import { TEST_VIEW } from 'JS/utils/test_data';

function getCurrentViewType() {
    let current_view = store.state[keys.g_current_view];
    
    if (!current_view) {
        return undefined;
    }
    
    return current_view['type'];
}

export function changePage() {

    function reloadOrNewComponent(current_component_name) {        
        if (window.location.hash == `#${PAGES_INFO[current_component_name].route.path}`) {
            ROUTER.navigate(`#${PAGES_INFO[current_component_name].route.path}`);
        } else {            
            window.location.hash = `#${PAGES_INFO[current_component_name].route.path}`;
        }
    }

    let view_type = getCurrentViewType();
    
    if (!view_type) {
        // Page 404.
        return;
    }

    /** @type {Router} */
    const ROUTER = document.querySelector(keys_router.ROUTER);
    
    console.log(`PAGE_NAME: ${view_type}`);
    
    if (view_type in PAGES_INFO) {
        reloadOrNewComponent(view_type);
    }
}

export function nextView() {
    store.dispatch(keys.a_update_view_index, {}); // Authentication is the first page.
    console.log(`s_current_view_index: ${store.state[keys.s_current_view_index]}`);
    changePage();
}

/**
 * 
 * @param {string} expected_view 
 * @return {boolean}
 */
export function guardView(expected_view) {
    let view_type = getCurrentViewType();
    if (view_type != expected_view) {
        console.warn(`${expected_view} not readable`);
        changePage();
        return false;
    }
    return true;
}

export function viewToObject(data) {
    let views = []
    for (let view of data) {
        if (view.hasOwnProperty('type') &&
            view['type'] in PAGES_INFO &&
            PAGES_INFO[view['type']].class_type &&
            typeof PAGES_INFO[view['type']].class_type.guard === 'function'
        ) {
            if (!PAGES_INFO[view['type']].class_type.guard(view)) {
                console.warn(`${view['type']} not readable`);
                views.push({});
            }
            views.push(new PAGES_INFO[view['type']].class_type(view));
        } else {
            views.push({});
        }
    }    
    return views;
}

export function experimentCompleted(views) {
    let experiment_completed = [];
    let page_task = views.filter(it => it['type'] == PAGE_NAMES.EXPE);
    for (let experiment of page_task) {
        experiment_completed.push(new Array(experiment['tasks'].length));
    }
    return experiment_completed;
}

export function formCompleted(views) {
    let form_completed = [];
    let page_form = views.filter(it => it['type'] == PAGE_NAMES.FORM);
    for (let _ of page_form) {
        form_completed.push(new Array());
    }
    return form_completed;
}

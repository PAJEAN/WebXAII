// @ts-check

/* Lib */
import { keys as keys_router, Router } from './router';
/* Namespaces */
import { PAGE_NAMES, PAGES_INFO } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
/* Utils */
import { DATA_URL } from 'JS/utils/constants';

function getCurrentViewType() {
    let current_view = store.state[keys.g_current_view];
    
    if (!current_view) {
        return undefined;
    }
    
    return current_view['type'];
}

/**
 * Views is link to pages with the "type" key and PAGE_INFO dict.
 */
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
        reloadOrNewComponent(PAGE_NAMES.AUTHENTICATION);
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
    let new_date = new Date();
    store.dispatch(keys.a_update_save, {
        time_on_page: new_date.getTime() - store.state[keys.s_time].getTime()
    });
    store.dispatch(keys.a_update_time, new_date);
    store.dispatch(keys.a_update_view_index, {}); // Authentication is the first page.

    console.log(`s_current_view_index: ${store.state[keys.s_current_view_index]}`);
    
    if (process.env.NODE_ENV == 'production') {
        // @ts-ignore
        axios.patch(DATA_URL, {
            uid: store.state.uid,
            data: store.state[keys.s_save]
        })
        .then(() => {
            console.log('Sending data');
            changePage();
        }, (err) => {
            console.error(err);
        });
    } else {
        changePage();
    }
    
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

/**
 * View objects is used in pages/components to less depend on json key.
 * @param {object} data 
 * @returns {Array<object>} View objects.
 */
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

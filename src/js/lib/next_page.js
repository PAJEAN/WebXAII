/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/task';

export function nextPage() {
    store.dispatch(keys.a_increment_view_index, {}); // Authentication is the first page.

    let current_index_view = store.state[keys.s_current_index_task];
    let current_view = store.state[keys.s_task][current_index_view];
    let view_type = current_view['type'];
    
    if (!view_type) {
        return;
    }
    
    console.log('VIEW TYPE: ' + view_type);    

    switch(view_type) {
        case 'form':
            window.location.hash = '#/test';
            break;
        case 'annotation':
            window.location.hash = '#/app';
            break;
        case 'rules':
            window.location.hash = '#/regles';
            break;
    }
}
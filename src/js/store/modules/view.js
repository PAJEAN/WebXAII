// @ts-check

/* Lib */
import { viewToObject } from 'JS/lib/view-manager';
/* Namespaces */
import { VIEW as NS } from './__namespaces__';
/* Utils */
import { TEST_VIEW } from 'JS/utils/test_data';
import { DATA_URL } from 'JS/utils/constants';


/* -------------------------------------------------------------------------- */
/*                                    KEYS                                    */
/* -------------------------------------------------------------------------- */

export const keys = {
    /*** STATES ***/
    /* -------------------------------- view -------------------------------- */
    s_view:               `${NS}_view`,               // All json views info.
    s_view_objects:       `${NS}_view_objects`,       // All views objects.
    s_current_view_index: `${NS}_current_view_index`, // Current index on s_view.
    /* -------------------------------- save -------------------------------- */
    s_save: `${NS}_save`,
    s_time: `${NS}_time`,
    /* -------------------------- experiment & task ------------------------- */
    s_current_task_index:       `${NS}_current_index_task`,       // Annotation task index (each annotation in an experiment).
    s_experiment_scores:        `${NS}_experiment_scores`,         // Compute score for each experiment
   /* -------------------------------- global ------------------------------- */
    s_max_timer: `${NS}_max_timer`, // Time for one item.
    
    /*** ACTIONS ***/
    /* -------------------------------- view -------------------------------- */
    a_fetch_view:          `${NS}_fetch_view`,          // Get view from server.
    a_update_view_index:   `${NS}_update_view_index`,   // Update view index.
    /* -------------------------------- save -------------------------------- */
    a_update_save:    `${NS}_update_save`,
    a_update_time:    `${NS}_update_time`,
    /* -------------------------- experiment & task ------------------------- */
    a_update_current_task_index: `${NS}_update_current_index_task`,      // Update task index.
    a_update_experiment_scores:  `${NS}_update_experiment_scores`,       // Update scores.
    
    /*** GETTERS ***/
    g_view_length:        `${NS}_view_length`,       // Length of view.
    g_current_view:       `${NS}_current_view`,      // Get current view info.
    g_experiment_length:  `${NS}_experiment_length`, // Length of completed experiment.
}


/* -------------------------------------------------------------------------- */
/*                                   MODULE                                   */
/* -------------------------------------------------------------------------- */

export const module = {
    /*** STATES ***/
    state: {
        /* -------------------------------- view -------------------------------- */
        [keys.s_current_view_index]: 0,
        [keys.s_view]: TEST_VIEW,
        [keys.s_view_objects]: viewToObject(TEST_VIEW),
        /* -------------------------------- save -------------------------------- */
        [keys.s_save]: [],
        [keys.s_time]: new Date(),
        /* -------------------------- experiment & task ------------------------- */
        [keys.s_current_task_index]: 0,
        [keys.s_experiment_scores]: [],
        /* ------------------------------- global ------------------------------- */
        [keys.s_max_timer]: 10
    },
    
    /*** Actions ***/
    actions: {
        /* -------------------------------- view -------------------------------- */
        [keys.a_fetch_view](context, payload) {
            // return Promise.resolve();
            return new Promise((resolve, reject) => {
                // @ts-ignore
                axios.get(DATA_URL, {
                    params: {
                        uid: payload.uid
                    }
                })
                .then((response) => {
                    let data = response.data; // Response: null or an object.
                    if (data) {
                        let data_views = [{}, ...data.views]; // Add authentication view first.
                        context.commit(`${NS}_UPDATE_VIEW`, data_views);
                        context.commit(`${NS}_UPDATE_VIEW_OBJECTS`, data_views);
                        resolve(data);
                    } else {
                        reject();
                    }
                }, (err) => {
                    console.error(err);
                    reject();
                });
            });
        },
        [keys.a_update_view_index](context, payload) {
            context.commit(`${NS}_UPDATE_VIEW_INDEX`, context.state[keys.s_current_view_index] + 1);
        },
        /* -------------------------------- save -------------------------------- */
        [keys.a_update_save](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_SAVE`, payload);
        },
        [keys.a_update_time](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_TIME`, payload);
        },
        /* -------------------------- experiment & task ------------------------- */
        [keys.a_update_current_task_index](context, payload) {
            context.commit(`${NS}_UPDATE_TASK_INDEX`, payload);
        },
        [keys.a_update_experiment_scores](context, payload) {
            context.commit(`${NS}_UPDATE_EXPERIMENT_SCORES`, payload);
        },
    },
    
    /*** Mutations ***/
    mutations: {
        /* -------------------------------- view -------------------------------- */
        [`${NS}_UPDATE_VIEW`](state, payload) {
            state[keys.s_view] = payload;
        },
        [`${NS}_UPDATE_VIEW_INDEX`](state, payload) {            
            state[keys.s_current_view_index] = payload;
        },
        [`${NS}_UPDATE_VIEW_OBJECTS`](state, payload) {
            state[keys.s_view_objects] = viewToObject(payload);
        },
        /* -------------------------------- save -------------------------------- */
        [`${NS}_UPDATE_SAVE`](state, payload) {
            if (state[keys.s_current_view_index] == state[keys.s_save].length - 1) {
                state[keys.s_save][state[keys.s_current_view_index]] = {...state[keys.s_save][state[keys.s_current_view_index]], ...payload};
            } else {
                state[keys.s_save][state[keys.s_current_view_index]] = payload;
            }
        },
        [`${NS}_UPDATE_TIME`](state, payload) {
            state[keys.s_time] = payload;
        },
        /* -------------------------- experiment & task ------------------------- */
        [`${NS}_UPDATE_TASK_INDEX`](state, payload) {
            state[keys.s_current_task_index] = payload.index;
        },
        [`${NS}_UPDATE_EXPERIMENT_SCORES`](state, payload) {
            state[keys.s_experiment_scores].push(payload);
        },
    },
    
    /*** Getters ***/
    getters: {
        [keys.g_view_length]:  (state, key) => state[keys.s_view].length,
        [keys.g_current_view]: (state, key) => state[keys.s_view][state[keys.s_current_view_index]]
    }
}
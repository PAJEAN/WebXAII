// @ts-check

import { VIEW as NS } from './__namespaces__';

export const keys = {
    /* STATES */
    /* ---------------------------------- view ---------------------------------- */
    s_view:                  `${NS}_view`,               // All views info.
    s_current_view_index:    `${NS}_current_view_index`, // Current index on s_view.
    /* ---------------------------------- task ---------------------------------- */
    s_current_task_index:    `${NS}_current_task_index`, // Annotation task index.
    s_current_subtask_index: `${NS}_current_index_item`, // Annotation subtask index (each annotation in a task).
    s_task_completed:        `${NS}_task_completed`,     // Store user values and time for each subtask of a task.
    s_task_score:            `${NS}_task_score`,         // Compute score for each task.
    /* --------------------------------- global --------------------------------- */
    s_max_timer:             `${NS}_max_timer`,          // Time for one item.
    /* ACTIONS */
    a_fetch_view:                   `${NS}_fetch_view`,            // Get view from server.
    a_update_view_index:            `${NS}_update_view_index`,     // Update view index.
    a_update_completed_task:        `${NS}_update_completed_task`, // Put a new annotated item.
    a_update_task_index:            `${NS}_update_task_index`,     // Update completed task index.
    a_update_current_subtask_index: `${NS}_update_current_index_task`,
    /* GETTERS */
    g_view_length:  `${NS}_view_length`, // Length of view.
    g_task_length:  `${NS}_task_length`, // Length of completed task.
    g_current_view: `${NS}_current_view` // Get current view info.
}

export const module = {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    state: {
        [keys.s_current_view_index]: 0,
        [keys.s_current_task_index]: 0,
        [keys.s_current_subtask_index]: 0,
        [keys.s_max_timer]: 10,

        [keys.s_view]: [
            // {}, // Authentication.
            // {
            //     type: 'rules'
            // },
            {
                rule: 'Exactly 3 squares',
                type: 'page-task',
                is_training: true, // opt.
                time: '',
                sub_task: [
                    {
                        card: 'assets/datasets/2.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/6.jpg',
                        expected: 0
                    }
                ]
            },
            {
                type: 'page-text',
                title: 'Rule',
                text: 'Exactly 3 squares',
                btn: 'Next'
            },
            {
                type: 'page-test',
                questions: [
                    {
                        type: 'radio',
                        title: '',
                        sub_title: 'Voici un sous texte plus long !',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    },
                    {
                        type: 'checkbox',
                        title: 'Title 2',
                        sub_title: 'Sub title 2',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    },
                    {
                        type: 'radio',
                        title: 'Title 3',
                        sub_title: 'Sub title 3',
                        answers: [
                            'choix1',
                            'choix2',
                        ]
                    }
                ]
            },
            {
                rule: 'Exactly 3 squares',
                type: 'page-task',
                is_training: true, // opt.
                time: '',
                sub_task: [
                    {
                        card: 'assets/datasets/2.jpg',
                        model: 0,
                        explicability: ['assets/datasets/2target_0.jpg', 'assets/datasets/2target_0.jpg'],
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/6.jpg',
                        model: 1,
                        explicability: ['assets/datasets/6target_0.jpg'],
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/40.jpg',
                        model: 1,
                        explicability: ['assets/datasets/40target_0.jpg'],
                        expected: 1
                    },
                    {
                        card: 'assets/datasets/52.jpg',
                        model: 0,
                        explicability: ['assets/datasets/52target_0.jpg'],
                        expected: 1
                    }
                ]
            },
            {
                rule: 'Exactly 3 squares',
                type: 'page-task',
                is_training: true, // opt.
                time: '',
                sub_task: [
                    {
                        card: 'assets/datasets/2.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/6.jpg',
                        expected: 0
                    }
                ]
            }
        ],
        [keys.s_task_completed]: [
            [
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                }
            ],
            [
                {
                    value: -1,
                    time: 0
                },
                {
                    value: -1,
                    time: 0
                }
            ]
        ]
    },
    /* -------------------------------------------------------------------------- */
    /*                                   Actions                                  */
    /* -------------------------------------------------------------------------- */
    actions: {
        [keys.a_fetch_view](context, payload) {
            return Promise.resolve();
            // return new Promise((resolve, reject) => {
            //     axios.post(USER_URL, {uid: payload.uid})
            //     .then((response) => {
            //         const data = response.data; // Response: null or an object.
            //         if (data) {
            //             context.commit(`${NS}_UPDATE_VIEW`, {task: data});
            //             resolve();
            //         } else {
            //             reject();
            //         }
            //     }, (err) => {
            //         reject();
            //     });
            // });
        },
        [keys.a_update_view_index](context, payload) {
            let current_view_index = context.state[keys.s_current_view_index];
            context.commit(`${NS}_UPDATE_VIEW_INDEX`, {index: current_view_index + 1});
        },
        [keys.a_update_completed_task](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_COMPLETED_TASK`, payload);
        },
        [keys.a_update_task_index](context, payload) {
            context.commit(`${NS}_UPDATE_TASK_INDEX`, payload);
        },
        [keys.a_update_current_subtask_index](context, payload) {
            context.commit(`${NS}_UPDATE_SUBTASK_INDEX`, payload);
        }
    },
    /* -------------------------------------------------------------------------- */
    /*                                  Mutations                                 */
    /* -------------------------------------------------------------------------- */
    mutations: {
        [`${NS}_UPDATE_VIEW`](state, payload) {
            state[keys.s_view] = payload.task;
        },
        [`${NS}_UPDATE_VIEW_INDEX`](state, payload) {
            state[keys.s_current_view_index] = payload.index;
        },
        [`${NS}_UPDATE_COMPLETED_TASK`](state, payload) {
            state[keys.s_task_completed][state[keys.s_current_task_index]][state[keys.s_current_subtask_index]] = payload;
        },
        [`${NS}_UPDATE_TASK_INDEX`](state, payload) {
            state[keys.s_current_task_index] = payload.index;
        },
        [`${NS}_UPDATE_SUBTASK_INDEX`](state, payload) {
            state[keys.s_current_subtask_index] = payload.index;
        },
    },
    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */
    getters: {
        [keys.g_view_length]:  (state, key) => state[keys.s_view].length,
        [keys.g_task_length]:  (state, key) => state[keys.s_task_completed].length,
        [keys.g_current_view]: (state, key) => state[keys.s_view][state[keys.s_current_view_index]]
    }
}
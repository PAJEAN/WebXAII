// @ts-check

import { VIEW as NS } from './__namespaces__';

export const keys = {
    /*** STATES ***/
    /* -------------------------------- view -------------------------------- */
    s_view:                  `${NS}_view`,               // All views info.
    s_current_view_index:    `${NS}_current_view_index`, // Current index on s_view.
    /* -------------------------- experiment & task ------------------------- */
    s_current_experiment_index: `${NS}_current_experiment_index`, // Annotation experiment index.
    s_current_task_index:       `${NS}_current_index_task`,       // Annotation task index (each annotation in an experiment).
    s_experiment_completed:     `${NS}_experiment_completed`,     // Store user values and time for each task of an experiment.
    s_experiment_score:         `${NS}_experiment_score`,         // Compute score for each experiment.
    /* -------------------------------- form -------------------------------- */
    s_current_form_index:       `${NS}_current_form_index`,       // Current completed form index.
    s_form_completed:           `${NS}_form_completed`,           // Store responses of completed forms.
   /* -------------------------------- global ------------------------------- */
    s_max_timer:             `${NS}_max_timer`, // Time for one item.
    
    /*** ACTIONS ***/
    /* -------------------------------- view -------------------------------- */
    a_fetch_view:                  `${NS}_fetch_view`,                  // Get view from server.
    a_update_view_index:           `${NS}_update_view_index`,           // Update view index.
    /* -------------------------- experiment & task ------------------------- */
    a_update_experiment_completed: `${NS}_update_experiment_completed`, // Put a new task.
    a_update_experiment_index:     `${NS}_update_experiment_index`,     // Update completed experiment index.
    a_update_current_task_index:   `${NS}_update_current_index_task`,   // Update task index.
    /* -------------------------------- form -------------------------------- */
    a_update_form_completed: `${NS}_update_form_completed`,   // Put new answers in completed form.
    a_update_form_index:     `${NS}_update_experiment_index`, // Update completed form index.
    
    /*** GETTERS ***/
    g_view_length:        `${NS}_view_length`,       // Length of view.
    g_current_view:       `${NS}_current_view`,      // Get current view info.
    g_experiment_length:  `${NS}_experiment_length`, // Length of completed experiment.
}

export const module = {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    state: {
        /* ------------------------------ view ------------------------------ */
        [keys.s_current_view_index]: 0,
        /* -------------------------- experiment & task ------------------------- */
        [keys.s_current_experiment_index]: 0,
        [keys.s_current_task_index]: 0,
        /* ------------------------------ form ------------------------------ */
        [keys.s_current_form_index]: 0,
        /* ----------------------------- global ----------------------------- */
        [keys.s_max_timer]: 10,
        /* ------------------------------ data ------------------------------ */
        [keys.s_view]: [
            // {}, // Authentication.
            // {
            //     type: 'rules'
            // },
            {
                type: 'page-task',
                desc: 'Exactly 3 squares',
                is_training: true, // opt.
                time: '',
                task: [
                    {
                        source: {
                            is_image: true,
                            text: 'assets/datasets/2.jpg'
                        },
                        model: {
                            is_image: false,
                            text: "Ceci est un texte pour le modèle"
                            
                        },
                        explanation: [
                            {
                                is_image: true,
                                text: 'assets/datasets/test_lg.png',
                                
                            }
                        ],
                        expected: 0
                    },
                    {
                        source: {
                            is_image: true,
                            text: 'assets/datasets/2.jpg',
                        },
                        expected: 0
                    },
                ],
                choice: {
                    type: 'radio',
                    title: 'Title',
                    sub_title: 'Voici un sous texte plus long !',
                    answers: [
                        'choix1',
                        'choix2',
                    ]
                }
            },
            {
                type: 'page-form',
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
                type: 'page-text',
                title: 'Rule',
                text: 'Exactly 3 squares',
                btn: 'Next'
            },
            {
                rule: 'Exactly 3 squares',
                type: 'page-task',
                is_training: true, // opt.
                time: '',
                task: [
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
                task: [
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
        ],
        [keys.s_form_completed]: [
            [],
        ],
        [keys.s_experiment_completed]: [
            [
                {
                    response: [],
                    time: 0
                },
                {
                    response: [],
                    time: 0
                }
            ],
            [
                {
                    response: [],
                    time: 0
                },
                {
                    response: [],
                    time: 0
                },
                {
                    response: [],
                    time: 0
                },
                {
                    response: [],
                    time: 0
                }
            ],
            [
                {
                    response: [],
                    time: 0
                },
                {
                    response: [],
                    time: 0
                }
            ]
        ]
    },
    /* -------------------------------------------------------------------------- */
    /*                                   Actions                                  */
    /* -------------------------------------------------------------------------- */
    actions: {
        /* ------------------------------ view ------------------------------ */
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
        /* ------------------------ experiment & task ----------------------- */
        [keys.a_update_experiment_completed](context, payload) { // Update a subtask in completed tasks.
            context.commit(`${NS}_UPDATE_EXPERIMENT_COMPLETED`, payload);
        },
        [keys.a_update_experiment_index](context, payload) {
            context.commit(`${NS}_UPDATE_EXPERIMENT_INDEX`, payload);
        },
        [keys.a_update_current_task_index](context, payload) {
            context.commit(`${NS}_UPDATE_TASK_INDEX`, payload);
        },
        /* ------------------------------ form ------------------------------ */
        [keys.a_update_form_completed](context, payload) {
            context.commit(`${NS}_UPDATE_FORM_COMPLETED`, payload);
        },
        [keys.a_update_form_index](context, payload) {
            context.commit(`${NS}_UPDATE_FORM_INDEX`, payload);
        },
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
        [`${NS}_UPDATE_EXPERIMENT_COMPLETED`](state, payload) {
            state[keys.s_experiment_completed][state[keys.s_current_experiment_index]][state[keys.s_current_task_index]] = payload;
        },
        [`${NS}_UPDATE_EXPERIMENT_INDEX`](state, payload) {
            state[keys.s_current_experiment_index] = payload.index;
        },
        [`${NS}_UPDATE_TASK_INDEX`](state, payload) {
            state[keys.s_current_task_index] = payload.index;
        },
        [`${NS}_UPDATE_FORM_COMPLETED`](state, payload) {
            state[keys.s_form_completed][state[keys.s_current_form_index]] = payload.answer;
        },
        [`${NS}_UPDATE_FORM_INDEX`](state, payload) {
            state[keys.s_current_form_index] = payload.index;
        },
    },
    /* -------------------------------------------------------------------------- */
    /*                                   Getters                                  */
    /* -------------------------------------------------------------------------- */
    getters: {
        [keys.g_view_length]:  (state, key) => state[keys.s_view].length,
        [keys.g_task_length]:  (state, key) => state[keys.s_experiment_completed].length,
        [keys.g_current_view]: (state, key) => state[keys.s_view][state[keys.s_current_view_index]]
    }
}
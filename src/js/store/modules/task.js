import { TASK as NS } from './__namespaces__';

export const keys = {
    // STATES.
    s_task:               `${NS}_task`,
    s_current_index_task: `${NS}_current_index_task`,
    s_current_index_item: `${NS}_current_index_item`,
    s_annotated_task:     `${NS}_annotated_task`, // Store user values and time for each item.
    s_task_score:         `${NS}_annotated_task`, // Compute score for each task.
    s_max_timer:          `${NS}_max_timer`, // Time for one item.
    // ACTIONS.
    a_get_task:                  `${NS}_randomize_profils`,
    a_update_annotated_item:     `${NS}_update_item`, // Put a new annotated item.
    a_update_current_index_item: `${NS}_update_current_index_task`,
    // GETTERS.
    g_task_length:  `${NS}_profils_length`,
    g_current_task: `${NS}_current_task`,
    g_current_item: `${NS}_current_item`,
}

export const module = {
    state: {
        [keys.s_task]: [
            {
                rule: 'Exactly 3 squares',
                items: [
                    {
                        card: 'assets/datasets/2.jpg',
                        model: 0,
                        explicability: 'assets/datasets/2target_0.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/6.jpg',
                        model: 1,
                        explicability: 'assets/datasets/6target_0.jpg',
                        expected: 0
                    },
                    {
                        card: 'assets/datasets/40.jpg',
                        model: 1,
                        explicability: 'assets/datasets/40target_0.jpg',
                        expected: 1
                    },
                    {
                        card: 'assets/datasets/52.jpg',
                        model: 0,
                        explicability: 'assets/datasets/52target_0.jpg',
                        expected: 1
                    }
                ]
            },
            {
                rule: 'lorem ipsum',
                items: [
                    {
                        card: 'assets/img/warning.png',
                        expected: 0
                    },
                    {
                        card: 'assets/img/warning.png',
                        expected: 0
                    }
                ]
            }
        ],
        [keys.s_current_index_task]: 0,
        [keys.s_current_index_item]: 0,
        [keys.s_annotated_task]: [
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
        ],
        [keys.s_max_timer]: 10,
    },
    actions: {
        [keys.a_randomize_profils](context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(USER_URL, {uid: payload.uid})
                .then((response) => {
                    const data = response.data; // Response: null or an object.
                    if (data) {
                        context.commit(`${NS}_GET_TASK`, {task: data});
                        resolve();
                    } else {
                        reject();
                    }
                }, (err) => {
                    reject();
                });
            });
        },
        [keys.a_update_annotated_item](context, payload) {
            context.commit(`${NS}_UPDATE_ANNOTATED_ITEM`, payload);
        },
        [keys.a_update_current_index_item](context, payload) {
            let annotated_task = context.state[keys.s_annotated_task];
            let current_index_task = context.state[keys.s_current_index_task];
            let current_index_item = context.state[keys.s_current_index_item];
            if (current_index_item + 1 >= annotated_task[current_index_task].length) {
                context.commit(`${NS}_UPDATE_INDEX_TASK`, {index: current_index_task + 1});
                context.commit(`${NS}_UPDATE_INDEX_ITEM`, {index: 0});
            } else {
                context.commit(`${NS}_UPDATE_INDEX_ITEM`, {index: current_index_item + 1});
            }
        }
    },
    mutations: {
        [`${NS}_GET_TASK`](state, payload) {
            state[keys.s_task] = payload.task;
        },
        [`${NS}_UPDATE_ANNOTATED_ITEM`](state, payload) {
            state[keys.s_annotated_task][state[keys.s_current_index_task]][state[keys.s_current_index_item]] = payload;
        },
        [`${NS}_UPDATE_INDEX_TASK`](state, payload) {
            state[keys.s_current_index_task] = payload.index;
        },
        [`${NS}_UPDATE_INDEX_ITEM`](state, payload) {
            state[keys.s_current_index_item] = payload.index;
        },
    },
    getters: {
        [keys.g_task_length]: (state, key) => state[keys.s_task].length,
        [keys.g_current_task]: (state, key) => state[keys.s_task][state[keys.s_current_index_task]],
        [keys.g_current_item]: (state, key) => state[keys.s_task][state[keys.s_current_index_task]]['items'][state[keys.s_current_index_item]],
    }
}
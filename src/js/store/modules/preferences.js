import { PREFERENCES as NS } from './__namespaces__';

export const keys = {
    // STATES.
    s_name_app:   `${NS}_name_app`,
    s_profil_min: `${NS}_profil_min`,
    s_profil_max: `${NS}_profil_max`,
    s_profils:    `${NS}_profils`,
    s_titles:     `${NS}_titles`,
    s_ordering:   `${NS}_ordering`,
    s_select:     `${NS}_select`,
    s_select_hashtags: `${NS}_select_hashtags`,
    // ACTIONS.
    a_randomize_profils: `${NS}_randomize_profils`,
    a_init_ordering:     `${NS}_init_ordering`,
    a_update_order:      `${NS}_update_order`,
    a_update_intensity:  `${NS}_update_intensity`,
    a_clear_ordering:    `${NS}_clear_ordering`,
    // GETTERS.
    g_profils_length: `${NS}_profils_length`,
    g_titles_length:  `${NS}_titles_length`,
    g_is_full:        `${NS}_is_full`,
}

export const module = {
    state: {
        [keys.s_name_app]: 'Kami',
        [keys.s_profil_min]: '000000',
        [keys.s_profil_max]: '111111',
        /* Bars */
        [keys.s_profils]: [
            '111100',
            '111101',
            '111000',
            '111011',
            /*'111010',
            '111001',
            '110111',
            '110110',
            '110101',
            '110011',
            '101111',
            '101110',
            '101101',
            '101011',
            '100111',
            '011111',
            '011110',
            '011101',
            '011011',
            '010111',
            '001111' */
        ],
        /* Header */
        [keys.s_titles]: [
            {name: 'Physique', help: 'Aide pour le physique.'},
            {name: 'Psychosocial', help: 'Aide pour le psychosocial'},
            {name: 'Nutritionnel', help: 'Aide pour le nutritionnel'},
            {name: 'Cognitif', help: 'Aide pour le cognitif'},
            {name: 'Habitat', help: "Aide pour l'habitat"},
            {name: 'Economique', help: "Aide pour l'économie."}
        ],
        [keys.s_ordering]: [],
        [keys.s_select]: [
            'Evaluer la différence',
            'Aucune différence',
            'Très faible différence',
            'Faible différence',
            'Moyenne différence',
            'Forte différence',
            'Très forte différence',
            'Extrême différence'
        ],
        [keys.s_select_hashtags]: [
            '#null',
            '#very weak',
            '#weak',
            '#medium',
            '#strong',
            '#very strong',
            '#extreme'
        ],
    },
    actions: {
        [keys.a_randomize_profils](context, payload) {
            /* Randomized order */
            let profils = [...context.state[keys.s_profils]];
            for (let [i, bar] of profils.entries()) {
                if (Math.random() > 0.5) {
                    let rand = Math.floor(Math.random() * profils.length);
                    let tmp = profils[rand];
                    profils[rand] = bar;
                    profils[i] = tmp;
                }
            }
            context.commit(`${NS}_UPDATE_PROFILS`, {profils});
        },
        [keys.a_init_ordering](context, payload) { /* Init ordering state */
            let profils = [context.state[keys.s_profil_min], ...context.state[keys.s_profils], context.state[keys.s_profil_max]];
            profils.forEach(_ => {
                context.commit(`${NS}_ADD_NULL_ENTRY`, payload);
            });
            context.commit(`${NS}_UPDATE_ORDER`, {index: 0, profil: context.state[keys.s_profil_min]});
            context.commit(`${NS}_UPDATE_INTENSITY`, {index: 0, intensity: -1});
            context.commit(`${NS}_UPDATE_ORDER`, {index: profils.length - 1, profil: context.state[keys.s_profil_max]});
        },
        [keys.a_update_order](context, payload) { /* Add a bar in target container */
            let index = context.state[keys.s_ordering].findIndex(el => el && el.profil == payload.profil);
            context.commit(`${NS}_UPDATE_ORDER`, payload);
            if (index != -1) {
                payload.index = index;
                payload.profil = null;
                context.commit(`${NS}_UPDATE_ORDER`, payload);
            }
        }, /* Update intensity of a bar */
        [keys.a_update_intensity](context, payload) {
            payload.index = context.state[keys.s_ordering].findIndex(el => el && el.profil == payload.profil);
            if (payload.index != -1) {
                context.commit(`${NS}_UPDATE_INTENSITY`, payload);
            }
        },
        [keys.a_clear_ordering](context, payload) {
            context.commit(`${NS}_CLEAR_ORDERING`, payload);
        }
    },
    mutations: {
        [`${NS}_UPDATE_PROFILS`](state, payload) {
            state[keys.s_profils] = payload.profils;
        },
        [`${NS}_ADD_NULL_ENTRY`](state, payload) {
            state[keys.s_ordering].push(null);
        },
        [`${NS}_UPDATE_ORDER`](state, payload) {
            state[keys.s_ordering][payload.index] = payload.profil ? new Bar(payload.profil): null;
        },
        [`${NS}_UPDATE_INTENSITY`](state, payload) {
            state[keys.s_ordering][payload.index].setIntensity(payload.intensity);
        },
        [`${NS}_CLEAR_ORDERING`](state, payload) {
            state[keys.s_ordering] = [];
        },
    },
    getters: {
        [keys.g_profils_length]: (state, key) => state[keys.s_profils].length + 2, /* Min & Max */
        [keys.g_titles_length]: (state, key) => state[keys.s_titles].length,
        [keys.g_is_full]: (state, key) => state[keys.s_ordering].filter(el => el === null || el.intensity == 0).length == 0, /* User has completed the annotation */
    }
}

/*** Classes ***/
class Bar {
    constructor (profil, intensity = 0) {
        this.profil    = profil;
        this.intensity = intensity;
    }

    setIntensity (new_intensity) {
        if (typeof new_intensity == 'number') {
            this.intensity = new_intensity;
        } else {
            console.error('Intensity attribute is a number');
        }
    }
}
/* Utils */
import { USER_URL } from 'JS/utils/constants';

export const keys = {
    a_login: `login`,
    a_logout: `logout`
};

export const module = {
    state: {
        is_authentication: false,
        uid: '',
        roles: []
    },
    actions: {
        [keys.a_login](context, payload) {
            context.commit(`AUTHENTICATION`, payload);
            context.commit(`UID`, payload);
            context.commit(`ADD_ROLES`, payload);
            // return new Promise((resolve, reject) => {
            //     axios.post(USER_URL, {uid: payload.uid})
            //     .then((response) => {
            //         const data = response.data; // Response: null or an object.
            //         if (data) {
            //             context.commit(`AUTHENTICATION`, {is_authentication: true});
            //             context.commit(`UID`, payload);
            //             context.commit(`ADD_ROLES`, {role: data.role ? data.role : 'user'});
            //             resolve();
            //         } else {
            //             reject();
            //         }
            //     }, (err) => {
            //         reject(err);
            //     });
            // });
        },
        [keys.a_logout](context, payload) {
            context.commit(`AUTHENTICATION`, {is_authentication: false});
            context.commit(`UID`, {uid: ''});
            context.commit(`CLEAR_ROLES`, {});
        },
    },
    mutations: {
        AUTHENTICATION(state, payload) {
            state.is_authentication = payload.is_authentication;
        },
        UID(state, payload) {
            state.uid = payload.uid;
        },
        CLEAR_ROLES(state, payload) {
            state.roles = [];
        },
        ADD_ROLES(state, payload) {
            state.roles = [...state.roles, payload.role];
        }
    },
    getters: {
        'is_auth': (state) => state['is_authentication'] ? state['is_authentication'] : false,
        'roles': (state) => state['roles'] ? state['roles'] : []
    }
}
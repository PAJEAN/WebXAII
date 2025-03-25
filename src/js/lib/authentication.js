/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/common';

export function login(uid) {
    return new Promise((resolve, reject) => {
        store.dispatch(keys.a_login, {uid: uid})
        .then(() => { // If user exist.
            resolve();
        })
        .catch((err) => { // Otherwise.
            reject(err);
        });
    });
}
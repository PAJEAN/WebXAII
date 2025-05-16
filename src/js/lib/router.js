// @ts-check

/* Namespaces */
import { PAGES_INFO } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index.js';

export const keys = {
    ROUTER: 'app-router',
    ROUTE:  'app-route',
    OUTLET: 'app-outlet'
}

/**
 * Example: user/manager/administrator.
 * @param {string} hash 
 * @returns {Array<string>}
 */
function parseTokens(hash) {
    return hash
        .split('/')
        .filter(token => {
            return token !== '';
        });
}

export class Router extends HTMLElement {
    constructor() {
        super();
        this.current_route;
        this.routes;
        this.default_route = (() => {
            let default_route = null;
            let route = this.querySelector(`${keys.ROUTE}[is-default]`);
            if (route) {
                default_route = {
                    path: route.getAttribute('path'),
                    title: route.getAttribute('title'),
                    component: route.getAttribute('component'),
                    params: {}
                };
            }
            return default_route; 
        })();
    }

    get outlet() {
        return this.querySelector(keys.OUTLET);
    }

    _initRoutes() {
        /** @type {Router} */
        const ROUTER = document.querySelector(keys.ROUTER);
        for (let page_name in PAGES_INFO) {
            let route = document.createElement(keys.ROUTE);
            let page_info = PAGES_INFO[page_name];
            
            if (!page_info.hasOwnProperty('route')) { continue; }
            
            let route_info = page_info['route'];
            for (let attribute in route_info) {
                if (attribute == 'is_default') {
                    route.setAttribute('is-default', '');
                } else {
                    route.setAttribute(attribute, route_info[attribute]);
                }
                route.setAttribute('component', page_name);
            }
            ROUTER.appendChild(route);
        }
    }

    navigate(hash) {
        let navigate = false;
        let matched_route = this._match(hash);
        if (matched_route) {
            if (matched_route.roles.length > 0) {
                if (store.state.is_auth && store.state.is_auth === true && store.state.roles && matched_route.roles.some((el) => store.state.roles.includes(el))) { // Interception between state.roles and matched_roles.
                    navigate = true;
                }
            }
            else {
                navigate = true;
            }
        }

        if (navigate) {
            this.current_route = matched_route;
            this._update();
        }
        else if (this.default_route) {
            window.history.replaceState(null, null, `${window.location.pathname}#${this.default_route.path}`);
            this.current_route = this.default_route;
            this._update();
        }
        else {
            console.warn(`No matched page found`);
        }
    }

    _match(hash) {
        const param_re = /^:(.+)/;
        hash = hash || '';
        hash = hash[0] !== '#' ? hash : hash.substring(1);
        let match, route_tokens, max, hash_token, route_token, missed, params, dynamic_match;
        let hash_tokens = parseTokens(hash);
        for (let route of this.routes) {
            route_tokens = parseTokens(route.path);
            max = Math.max(route_tokens.length, hash_tokens.length);
            missed = false;
            params = {};
            for (let i = 0; i < max; i++) {
                hash_token = hash_tokens[i];
                route_token = route_tokens[i];

                dynamic_match = param_re.exec(route_token); // If #/auth/:user-id then #/auth or #/auth/123 is possible.

                if (hash_token === undefined && !dynamic_match) {
                    missed = true;
                    break;
                }

                if (dynamic_match) {
                    if (hash_token !== undefined) {
                        params[dynamic_match[1]] = hash_token;
                    }
                }
                else if (hash_token !== route_token) {
                    missed = true;
                    break;
                }
            }

            if (!missed) {
                match = {params, ...route};
                break;
            }
        }
        return match;
    }

    _update() {
        const {component, title, params = {}} = this.current_route;
        if (component) {
            this.outlet.textContent = '';
            const view = document.createElement(component);
            document.title = title || document.title;
            for (let param in params) {
                view.setAttribute(param, params[param]);
            }
            this.outlet.appendChild(view);
        }
    }
  
    connectedCallback() {
        this._initRoutes();

        this.routes = Array.from(this.querySelectorAll(keys.ROUTE))
                .filter(node => node.parentNode === this)
                .map(node => ({
                    path: node.getAttribute('path'),
                    title: node.getAttribute('title'), 
                    component: node.getAttribute('component'),
                    roles: node.hasAttribute('roles') ? parseTokens(node.getAttribute('roles')) : []
        }));
        
        
        this.navigate(window.location.hash);
        window.addEventListener('hashchange', () => {
            this.navigate(window.location.hash);
        });
    }
  
    disconnectedCallback() {}
}

try {
    (function() {
        window.customElements.define(keys.ROUTER, Router);
    })()
}
catch (err) {
    console.error(err);
}
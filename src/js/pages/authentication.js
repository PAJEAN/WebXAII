/* Lib */
import { login } from '../lib/authentication.js';
/* Store */
import { store } from 'JS/store/index';
// import { keys as a_keys } from 'JS/store/modules/common';
// import { keys as p_keys } from 'JS/store/modules/preferences';

try {
    (function() {
        const PAGE_NAME = 'page-authentication';

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                /* -- TYPES -- */
                /* Positioning */
                /* Display & Box Model */
                /* Color */  
                /* Text */
                /* Other */

                #main-page {
                    min-height: 100vh;
                }
                .loading {
                    display: none;
                }
                .container {
                    /* Display & Box Model */
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                    width: 400px;
                    padding: 30px;
                    /* Color */  
                    background-color: rgba(var(--surface-color));
                }
                .deconnexion {
                    /* Display & Box Model */
                    display: none;
                    width: 400px;
                    /* Text */
                    text-align:center;
                }
                .title {
                    text-align: center;
                    font-size: 40px;
                    letter-spacing: 3px;
                }
                .sub-title {
                    /* Text */
                    text-align: center;
                    font-size: 20px;
                    letter-spacing: 2px;
                }
                .icon {
                    width: 20px;
                }
                .signout {
                    margin: 20px 0;
                }
            </style>

            <div id="main-page" class="d-flex justify-content-center align-items-center">
                <div class="loading">
                    <wc-loading></wc-loading>
                </div>

                <div class="container connexion">
                    <div class="title">Welcome</div>
                    <div class="sub-title">xaipatimg</div>

                    <div class="input-group my-4">
                        <span class="input-group-text">
                            <img src="assets/img/locked.png" alt="Cadena" class="icon">
                        </span>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="floatingInputGroup1" placeholder="Username">
                            <label for="floatingInputGroup1">Identifier</label>
                        </div>
                    </div>

                    <button id="connexion-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100">Connexion</button>

                    <div id="error" class="text-center text-danger mt-4"></div>
                </div>

                <div class="container deconnexion">
                    <div>Vous êtes déja connecté. Voulez-vous vous déconnecter ?</div>

                    <button id="deconnexion-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100 my-4">Connexion</button>
                    
                    <a href="#/app">Revenir à l'application</a>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _connectUser(uid) {
                let login_content = this.content.querySelector('.connexion');
                let loading = this.content.querySelector('.loading');

                login_content.style.display = 'none';
                loading.style.display = 'block';

                login(uid)
                .then(() => {
                    window.location.hash = '#/regles';
                })
                .catch((err) => {
                    login_content.style.display = 'block';
                    loading.style.display = 'none';
                    this.error_tag.innerHTML = `Oups... Une erreur s'est produite !`;
                });
            }

            _init() {
                let login_content = this.content.querySelector('.connexion');
                let logout_content = this.content.querySelector('.deconnexion');

                if (!store.state['is_authentication']) {
                    login_content.style.display = 'block';
                    logout_content.style.display = 'none';

                    /* Tags */
                    let user_id = this.content.querySelector('input[type=text]');
                    let login_button = this.content.querySelector('#connexion-btn');
                    /* Behaviors */
                    login_button.addEventListener('click', () => {
                        this._connectUser(user_id.value);
                    });
                } else {
                    login_content.style.display  = 'none';
                    logout_content.style.display = 'block';

                    let logout_button = this.content.querySelector('#deconnexion-btn');
                    /* Behaviors */
                    logout_button.addEventListener('click', () => {
                        // store.dispatch(a_keys.a_logout,  {});
                        // store.dispatch(p_keys.a_clear_ordering, {});
                    });
                }
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* HTML tags */
                this.error_tag = this.content.querySelector('#error');
                /* Setup the page */
                this._init();
                /* Update UI */
                this.unsubscribe = store.events.subscribe('stateChange', this._init.bind(this));
            }
          
            disconnectedCallback () {
                this.unsubscribe();
            }
        });
    })();
}
catch (err) {
    console.error(err);
}


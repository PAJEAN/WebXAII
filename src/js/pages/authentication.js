/* CSS */
import css from 'CSS/style.css';
/* Lib */
import { login } from '../lib/authentication.js';
/* Store */
import { store } from 'JS/store/index';
import { keys as a_keys } from 'JS/store/modules/common';
import { keys as p_keys } from 'JS/store/modules/preferences';

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

                /* Import base css */
                ${css.toString()}

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
                    backdrop-filter: blur(5px);
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
                    /* Display & Box Model */
                    padding: 10px 0 25px 0;
                    /* Text */
                    text-align: center;
                    font-size: 20px;
                    letter-spacing: 3px;
                }
                .fields {
                    padding: 20px 0;
                    width: 100%;
                }
                .fields input {
                    /* Display & Box Model */
                    border-radius: 10px;
                    border: none;
                    outline: none;
                    width: 100%;
                    padding: 15px 10px 15px 50px;
                    /* Text */
                    font-size: 20px;
                }
                .icon {
                    /* Positioning */
                    position: absolute;
                    /* Display & Box Model */
                    width: 25px;
                    margin: 0 10px;
                }
                .error {
                    /* Display & Box Model */
                    padding: 10px 5px;
                    /* Text */
                    text-align: center;
                    /* Color */
                    color: red;
                }
                .signout {
                    margin: 20px 0;
                }
            </style>

            <div id="main-page" class="${css.locals.flex} ${css.locals.background}" style="--f__ai: center; --f__jc: center;">
                <div class="loading">
                    <wc-loading></wc-loading>
                </div>
                <div class="container connexion">
                    <div class="title">Connexion</div>
                    <div class="sub-title">${store.state[p_keys.s_name_app]}</div>

                    <div class="fields">
                        <div class="password ${css.locals.flex}" style="--f__ai: center;">
                            <img src="assets/img/locked.png" alt="Cadena" class="icon">
                            <input type="text" placeholder="Saisissez votre identifiant">
                        </div>
                    </div>

                    <div class="signin">
                        <wc-button data-text="Connexion" id="connexion-btn"></wc-button>
                    </div>

                    <div class="error"></div>
                </div>

                <div class="container deconnexion">
                    <div>Vous êtes déja connecté. Voulez-vous vous déconnecter ?</div>

                    <div class="signout">
                        <wc-button data-text="Déconnexion" id="deconnexion-btn"></wc-button>
                    </div>

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
                        store.dispatch(a_keys.a_logout,  {});
                        store.dispatch(p_keys.a_clear_ordering, {});
                    });
                }
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* HTML tags */
                this.error_tag = this.content.querySelector('.error');
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


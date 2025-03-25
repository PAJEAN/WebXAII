/* CSS */
import css from 'CSS/style.css';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences';
/* Utils */
import { MATRIX_URL } from 'JS/utils/constants';

try {
    (function() {
        const PAGE_NAME = 'page-results';

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

                .height-percent {
                    height: 100%;
                }
                .height-vh {
                    height: 100vh;
                }
                .loading {
                    display: none;
                }
                .container {
                    /* Display & Box Model */
                    border-radius: 10px;
                    width: 400px;
                    padding: 30px;
                    /* Color */
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                    box-shadow: var(--box-shadow);
                }
                .title {
                    /* Text */
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
                    width: 100%;
                    padding: 20px 0;
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
                    /* Color */
                    color: red;
                    /* Text */
                    text-align: center;
                }
                .results {
                    /* Text */
                    font-family: monospace;
                }
            </style>

            <div id="main-page" class="height-vh ${css.locals.flex} ${css.locals.background}" style="--f__ai: center; --f__jc: center;">
                <div class="loading">
                    <wc-loading></wc-loading>
                </div>
                <div class="container">
                    <div class="title">Résultats</div>
                    <div class="sub-title">${store.state[keys.s_name_app]}</div>

                    <div class="fields">
                        <div class="password ${css.locals.flex}" style="--f__ai: center;">
                            <img src="assets/img/locked.png" alt="Cadena" class="icon">
                            <input type="password" placeholder="Saisissez le mot de passe">
                        </div>
                    </div>

                    <div>
                        <wc-button data-text="Connexion"></wc-button>
                    </div>

                    <div class="error"></div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _format(data) {
                let hashtags = store.state[keys.s_select_hashtags];

                let msg = '';
                for (let key in data) {
                    
                    msg += `uid ${key};  \n`;
                    if (data[key].hasOwnProperty('date') && data[key].hasOwnProperty('matrix')) {
                        msg += `date: ${data[key]['date']}; \n`;
                        msg += 'param n:=6; \n';
                        msg += `param m:=${data[key]['matrix'].length}; \n`;
                        msg += '#param k:=2; \n';
                        msg += 'param nbSC:=6; \n';
                        msg += 'param dmin:=0.0001; \n';
                        msg += 'param values: 1 2 3 4 5 6 := \n';
                        for (let [i, bar] of data[key]['matrix'].entries()) {
                            msg += `${i + 1}\t${bar.profil.split('').map(el => el == '0' ? '1': '0').join('\t')}${i == data[key]['matrix'].length - 1 ? ';': ''} \n`;
                        }
                        msg += `param: valSCmin valSCmax := \n`
                        for (let [i, bar] of data[key]['matrix'].entries()) {
                            if (i > 0) { // The first has no preference.
                                msg += `${i} ${Math.max(bar.intensity - 1, 0)} ${bar.intensity} ${hashtags[bar.intensity - 1]} \n`;
                            }
                        }
                    }
                    msg += '; \n \n';
                }
                return msg;
            }

            _sendResults(pwd) {
                let auth_content = this.content.querySelector('.container');
                let loading = this.content.querySelector('.loading');

                auth_content.style.display = 'none';
                loading.style.display = 'block';

                axios.post(MATRIX_URL, {pwd: pwd})
                .then((response) => {
                    const data = response.data; // Response: null or an object.
                    if (data) {
                        this.content.classList.add('height-percent');
                        this.content.classList.remove(css.locals.flex);
                        this.content.classList.remove(css.locals.background);
                        this.content.classList.remove('height-vh');
                        let pre = document.createElement('pre');
                        pre.classList.add('results');
                        pre.innerHTML = this._format(data);
                        this.content.innerHTML = '';
                        this.content.appendChild(pre);
                    }
                }, (err) => {
                    auth_content.style.display = 'block';
                    loading.style.display = 'none';
                    this.error_tag.innerHTML = `Oups... Une erreur s'est produite !`;
                });
            }

            _init() {
                /* Tags */
                let user_id = this.content.querySelector('input[type=password]');
                let login_button = this.content.querySelector('wc-button');
                /* Behaviors */
                login_button.addEventListener('click', () => {
                    this._sendResults(user_id.value);
                });
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* HTML tags */
                this.error_tag = this.content.querySelector('.error');
                /* Setup the page */
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


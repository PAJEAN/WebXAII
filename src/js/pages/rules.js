/* CSS */
import css from 'CSS/style.css';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences';

try {
    (function() {
        const PAGE_NAME = 'page-rules';

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

                :root {
                    --container-width: 460px;
                    --container-height: 300px;
                }
                #main-page {
                    height: 100vh;
                }
                .title {
                    text-align: center;
                    font-size: 28px;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                .container {
                    width: var(--container-width);
                    padding: 30px;
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                    box-shadow: var(--box-shadow);
                    border-radius: 10px;
                    text-align: justify;
                }
                i {
                    font-size: 14px;
                }
                a {
                    text-decoration: none;
                }
                .button:hover {
                    box-shadow: none;
                }
                .center {
                    text-align: center;
                }
            </style>

            <div id="main-page" class="${css.locals.flex} ${css.locals.background}" style="--f__ai: center; --f__jc: center;">
                <div class="container">
                    <div class="title">Bienvenue au jeu ${store.state[keys.s_name_app]} !</div>
                    Votre mission dans le jeu : classer ${store.state[keys.g_profils_length] - 2} profils et évaluer les différences entre les profils !
                    <br><br>
                    Cet exercice va vous demander concentration et réflexion. Merci par avance de "jouer le jeu" et pour le temps précieux que vous y consacrerez.
                    <br><br>
                    <div class="center">
                        <a href="#/app"><wc-button data-text="Lancez le jeu"></wc-button></a>
                    </div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main');
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


/* CSS */
import css from 'CSS/style.css';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/task';

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
                    width: 50%;
                }
                .card {
                    box-shadow: var(--box-shadow);
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
                @media (max-width: 768px) {
                    .container {
                        width: 75%;
                    }
                }
            </style>

            <div id="main-page" class="d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card m-auto">
                        <div class="card-body">
                            <h3 id="rule-title" class="card-title text-uppercase text-center">Task</h3>
                            <div id="rule-text" class="text-center mt-3">Rule</div>
                            <div class="mt-3">
                                <a href="#/app"><button id="connexion-btn" type="button" class="btn btn-primary btn-lg text-uppercase mt-3 w-100">Go !</button></a>
                            </div>
                        </div>
                    </div>
                </div>    
            
                
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _init() {
                let tag_title = this.content.querySelector('#rule-title');
                tag_title.textContent = `Task n°${store.state[keys.s_current_index_task] + 1}`;
                let tag_text = this.content.querySelector('#rule-text');
                tag_text.textContent = `Rule : ${store.state[keys.s_task][store.state[keys.s_current_index_task]]['rule']}`;
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


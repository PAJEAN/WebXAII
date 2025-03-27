/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/task';

try {
    (function() {
        const PAGE_NAME = 'page-score';

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
                    height: 100vh;
                }
                .score {
                    font-size: 5em;
                }
            </style>

            <div id="main-page" class="container d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card w-75 m-auto">
                        <div class="card-body">
                            <h3 id="score-title" class="card-title text-uppercase text-center">Your score</h3>
                            <div id="score-value" class="text-center score">80%</div>
                            <div class="mt-4">
                                <button id="valid-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100">Next task</button>
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
                let tag = this.content.querySelector('#score-title');
                tag.textContent = `Your score for task n°${store.state[keys.s_current_index_task]}`;
                // Update score.
                // Init button.
                // Return to app or end.
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


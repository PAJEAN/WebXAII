// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.SCORE;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    height: 100vh;
                }
                .score {
                    font-size: 5em;
                }
                .card {
                    box-shadow: var(--box-shadow);
                }
            </style>

            <div id="main-page" class="container d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card w-75 m-auto">
                        <div class="card-body">
                            <h3 id="score-title" class="card-title text-uppercase text-center">Your score</h3>
                            <div id="score-value" class="text-center score">80%</div>
                            <div class="mt-4">
                                <button id="next-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100">Next</button>
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

            _title() {
                let tag = this.content.querySelector('#score-title');
                let text = '';
                if (store.state[keys.s_current_index_task] == 1) {
                    text = `Your score for the training task`;
                } else {
                    text = `Your score for the task n°${store.state[keys.s_current_index_task] - 1}`;
                }
                tag.textContent = text;
            }

            _nextBtn() {
                let tag = this.content.querySelector('#next-btn');
                tag.addEventListener('click', nextView);
            }

            _init() {
                this._title();
                this._nextBtn();
            }
         
            connectedCallback () {
                let is_legit = guardView(PAGE_NAMES.SCORE);
                if (!is_legit) { return; }

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


/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    (function() {
        const PAGE_NAME = 'page-countdown';

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
                            <h4 id="task-number" class="card-title text-uppercase text-center">Your score</h4>
                            <h4 id="countdown" class="card-title text-center mt-4">Your score</h4>
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
                let tag = this.content.querySelector('#task-number');
                let text = '';
                let index_task = store.state[keys.s_current_task_index];
                if (index_task == 0) {
                    text = 'Training task 1/1';
                } else {
                    text = `Task ${index_task}/${store.state[keys.g_task_length] - 1}`; // 0 is the training task.
                }
                tag.textContent = text;
            }

            _countdown() {
                let tag = this.content.querySelector('#countdown');
                tag.textContent = `Automatically starting in ${this.time}`;
                this.timer = setInterval(() => {
                    this.time -= 1;
                    tag.textContent = `Automatically starting in ${this.time}`;
                    if (this.time <= 0) {
                        window.location.hash = '#/app';
                    }
                }, 1000);
            }

            _init() {
                this._title();
                this._countdown();
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* Attributes */
                this.timer;
                this.time = 5;
                this._init();
            }
          
            disconnectedCallback () {
                if (this.timer) {
                    clearInterval(this.timer);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}


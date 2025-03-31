/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/task';

try {
    (function() {
        const PAGE_NAME = 'page-app';

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
                .container-decoration {
                    /* Display & Box Model */
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                }
                .icon {
                    max-width: 400px;
                }
            </style>

            <div id="main-page" class="d-flex flex-column justify-content-center">
                <h3 id="task" class="container">Task</h3>

                <div id="rule" class="container fs-5">
                    Rule: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
                
                <div id="current-status" class="container container-decoration d-flex justify-content-center p-2 mt-4"></div>
                
                <div id="timer" class="text-center fs-2 my-4">
                    10:00
                </div>

                <div class="container text-center">
                    <div id="dataset" class=" row rounded">
                        <div class="col-sm">
                            <div class="card">
                                <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Source image</h5>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card">
                                <img src="assets/img/pouce-en-lair.png" class="card-img-top icon" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Model prediction</h5>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card">
                                <img src="assets/datasets/2target_0.jpg" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Explanatory image</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container d-flex justify-content-between pt-4" style="gap: 1em">
                    <button id="valid-btn" type="button" class="btn btn-success btn-lg text-uppercase w-100">Valid</button>
                    <button id="not-valid-btn" type="button" class="btn btn-danger btn-lg text-uppercase w-100">Not valid</button>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _createCard(img_path, body_text) {
                let content_tag = /* html */`
                <div class="col-sm">
                    <div class="card">
                        <img src="${img_path}" class="card-img-top icon m-auto" alt="">
                        <div class="card-body">
                            <h5 class="card-title text-center">${body_text}</h5>
                        </div>
                    </div>
                </div>`;
                let div = document.createElement('div');
                div.classList.add('col-sm');
                div.innerHTML = content_tag;
                return div;
            }

            _currentStatus() {
                let tag = this.content.querySelector('#current-status');
                tag.textContent = '';
                let current_index_task = store.state[keys.s_current_index_task];
                // Annotated items is init with same format than each item task.
                let items = store.state[keys.s_annotated_task][current_index_task];
                for (let i = 0; i < items.length; i++) {
                    let div = document.createElement('div');
                    div.classList.add('mx-1');
                    switch(items[i]['value']) {
                        case 0: // Bad answer.
                            div.textContent = '🔴';
                            break;
                        case 1: // Good answer.
                            div.textContent = '🟢';
                            break;
                        case 2: // Pass.
                            div.textContent = '🟤';
                            break;
                        default:
                            div.textContent = '⚪';
                    }
                    tag.appendChild(div);
                }
            }

            _dataset() {
                let tag = this.content.querySelector('#dataset');
                tag.textContent = '';
                let current_item = store.state[keys.g_current_item];
                if (current_item.hasOwnProperty('card')) {
                    let div = this._createCard(current_item['card'], 'Source');
                    tag.appendChild(div);
                }
                if (current_item.hasOwnProperty('model')) {
                    let path = current_item['model'] == 0 ? 'assets/img/pouce-vers-le-bas.png': 'assets/img/pouce-en-lair.png';
                    let div = this._createCard(path, 'Model prediction');
                    tag.appendChild(div);
                }
                if (current_item.hasOwnProperty('explicability')) {
                    let div = this._createCard(current_item['explicability'], 'Explanation');
                    tag.appendChild(div);
                }
            }

            _rule() {
                let tag = this.content.querySelector('#rule');
                let current_task = store.state[keys.g_current_task];                
                tag.textContent = `Rule : ${current_task['rule']}`;
            }

            _task() {
                let tag = this.content.querySelector('#task');
                let text = '';
                if (store.state[keys.s_current_index_task] == 0) {
                    text = `Training task`;
                } else {
                    text = `Task n°${store.state[keys.s_current_index_task]}`;
                }
                tag.textContent = text;
            }

            _timer() {
                let tag = this.content.querySelector('#timer');
                tag.textContent = this.current_time.toFixed(2);
                let delta_time = 1000;
                this.timer = setInterval(() => {
                    this.current_time -= delta_time/1000;
                    tag.textContent = (Math.round(this.current_time * 100) / 100).toFixed(2);
                    if (this.current_time <= 0) {
                        this._transition(2, true);
                    }
                }, delta_time);                
            }

            _transition(response, is_time_exceeded) {
                let valid_btn = this.content.querySelector('#valid-btn');
                valid_btn.removeEventListener('click', this._validBound);
                let not_valid_btn = this.content.querySelector('#not-valid-btn');
                not_valid_btn.removeEventListener('click', this._notValidBound);
                clearInterval(this.timer);

                let value = -1;
                if (is_time_exceeded) {
                    value = 2;
                } else {
                    let current_index = store.state[keys.g_current_item];
                    value = current_index['expected'] == response ? 1: 0;
                }
                store.dispatch(keys.a_update_annotated_item, {value: value, time: Math.max(this.current_time, 0)});
                store.dispatch(keys.a_update_current_index_item, {});
                if (store.state[keys.s_current_index_task] >= store.state[keys.g_task_length] || store.state[keys.s_current_index_item] == 0) {
                    window.location.hash = '#/score';
                } else {
                    this._init();
                }                
            }

            _init() {
                this.current_time = store.state[keys.s_max_timer];
                this._initEvents();
                this._currentStatus();
                this._rule();
                this._task();
                this._dataset();
                this._timer();
            }
            
            _valid() {
                this._transition(1, false);
            }

            _notValid() {
                this._transition(0, false);
            }

            _initEvents() {
                let valid_btn = this.content.querySelector('#valid-btn');
                valid_btn.addEventListener('click', this._validBound);
                let not_valid_btn = this.content.querySelector('#not-valid-btn');
                not_valid_btn.addEventListener('click', this._notValidBound);
            }
            
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* Attributes */                
                this.current_time = store.state[keys.s_max_timer];
                this.timer;
                this._validBound = this._valid.bind(this); // Bind to remove listener (otherwise bind create a new function).
                this._notValidBound = this._notValid.bind(this);
                /* Init */
                this._init();
            }
          
            disconnectedCallback () {
                if(this.timer) {
                    clearInterval(this.timer);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
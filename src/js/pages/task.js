// @ts-check

/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.TASK;

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
                        <div class="col-lg">
                            <div class="card">
                                <img src="assets/img/pouce-en-lair.png" class="card-img-top icon" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Model prediction</h5>
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

            _createCardB(img_path, body_text) {
                let content_tag = /* html */`
                <div class="col-sm">
                    <div class="card">
                        <img src="${img_path}" class="card-img-top icon m-auto" alt="">
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
                let subtask = store.state[keys.s_task_completed][store.state[keys.s_current_task_index]];
                for (let i = 0; i < subtask.length; i++) {
                    let div = document.createElement('div');
                    div.classList.add('mx-1');
                    switch(subtask[i]['value']) {
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
                let task = store.state[keys.g_current_view];
                let subtask = task['sub_task'][store.state[keys.s_current_subtask_index]];
                
                if (subtask.hasOwnProperty('card')) {
                    let div = this._createCard(subtask['card'], 'Source');
                    tag.appendChild(div);
                }
                if (subtask.hasOwnProperty('model')) {
                    let path = subtask['model'] == 0 ? 'assets/img/pouce-vers-le-bas.png': 'assets/img/pouce-en-lair.png';
                    let div = this._createCard(path, 'Model prediction');
                    tag.appendChild(div);
                }
                if (subtask.hasOwnProperty('explicability')) {
                    let div = this._createCardB(subtask['explicability'], 'Explanation');
                    tag.appendChild(div);
                }
            }

            _rule() {
                let tag = this.content.querySelector('#rule');
                let task = store.state[keys.g_current_view];
                tag.textContent = `Rule : ${task['rule']}`;
            }

            _task() {
                let tag = this.content.querySelector('#task');
                let text = '';
                if (store.state[keys.s_current_task_index] == 0) {
                    text = `Training task`;
                } else {
                    text = `Task n°${store.state[keys.s_current_task_index]}`;
                }
                tag.textContent = text;
            }

            _timer() {
                let tag = this.content.querySelector('#timer');
                tag.textContent = this.current_time.toFixed(2);
                let delta_time = 1000;
                this._timer_count = window.setInterval(() => {
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

                clearInterval(this._timer_count);

                let task = store.state[keys.g_current_view];
                let subtask = task['sub_task'][store.state[keys.s_current_subtask_index]];

                let value = -1;
                if (is_time_exceeded) {
                    value = 2;
                } else {
                    value = subtask['expected'] == response ? 1: 0;
                }
                store.dispatch(keys.a_update_completed_task, {value: value, time: Math.max(this.current_time, 0)});

                console.log(store.state[keys.s_current_subtask_index], task['sub_task'].length)

                if (store.state[keys.s_current_subtask_index] + 1 >= task['sub_task'].length) {
                    store.dispatch(keys.a_update_current_subtask_index, {index: 0});
                    store.dispatch(keys.a_update_task_index, {index: store.state[keys.s_current_task_index] + 1});
                    nextView();
                } else {
                    store.dispatch(keys.a_update_current_subtask_index, {index: store.state[keys.s_current_subtask_index] + 1});
                    this._init();
                }      
            }

            _init() {
                this.current_time = store.state[keys.s_max_timer];
                this._initEvents();
                this._currentStatus();
                this._rule();
                this._task();
                // this._dataset();
                // this._timer();
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
                guardView(PAGE_NAMES.TASK);

                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                /* Attributes */                
                this.current_time = store.state[keys.s_max_timer];
                /** @type {number | undefined} */
                this._timer_count = undefined;
                this._validBound = this._valid.bind(this); // Bind to remove listener (otherwise bind create a new function).
                this._notValidBound = this._notValid.bind(this);
                /* Init */
                this._init();
            }
          
            disconnectedCallback () {
                if(this._timer_count) {
                    clearInterval(this._timer_count);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
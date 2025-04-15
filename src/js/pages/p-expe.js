// @ts-check

/* Namespaces */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { Experiment } from 'JS/store/modules/view-classes';
/* Types */
import { FormComponent } from 'JS/components/wc-form';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.EXPE;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    min-height: 100vh;
                }
                .container-decoration {
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                }
                .row {
                    margin: 0;
                }
                .card {
                    border: none;
                    box-shadow: var(--box-shadow);
                }
                .card-explanation .card {
                    margin-top: 1rem;
                }
                .icon {
                    max-height: 300px;
                    margin: auto;
                }
            </style>

            <div id="main-page" class="d-flex flex-column justify-content-center">

                <div class="container container-decoration mt-2 p-2">
                    <h3 id="task" class="container">Task</h3>
    
                    <div id="desc" class="container fs-5">
                        Rule: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>

                <div class="container mt-4">
                    <div class="row">
                        <div class="col-sm-9">
                            <div class="row" id="source-model">
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
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Model</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row card-explanation mb-2" id="explanation">
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
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card">
                                        <img src="assets/datasets/2.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-body">
                                            <h5 class="card-title text-center">Source image</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div id="current-status" class="container container-decoration d-flex justify-content-center"></div>

                            <div id="timer" class="text-center fs-2 my-2"></div>

                            <${COMPONENT_NAMES.FORM} id="form"></${COMPONENT_NAMES.FORM}>

                            <button id="submit-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100 my-4">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _createCard(body_title_text, text, is_image) {
                let col = document.createElement('div');
                col.classList.add('col-sm');
                let card = document.createElement('div');
                card.classList.add('card');
                if (is_image) {
                    let image = document.createElement('img');
                    image.setAttribute('src', text);
                    image.classList.add('img-fluid', 'rounded', 'icon');
                    card.appendChild(image);
                }
                let card_body = document.createElement('div');
                card_body.classList.add('card-body');
                if (!is_image) {
                    let body_text = document.createElement('div');
                    body_text.classList.add('mb-4')
                    body_text.textContent = text;
                    card_body.appendChild(body_text);
                }
                let body_title = document.createElement('h5');
                body_title.classList.add('card-title', 'text-center')
                body_title.textContent = body_title_text;
                card_body.appendChild(body_title);
                card.appendChild(card_body);
                col.appendChild(card);
                return col;
            }

            _currentStatus() {
                if (this.current_view.show_progression_bar) {
                    let tag = this.content.querySelector('#current-status');
                    tag.classList.add('p-2');
                    tag.textContent = '';
                    for (let i = 0; i < this.current_view.tasks.length; i++) {                    
                        let div = document.createElement('div');
                        div.classList.add('mr-1');
                        div.textContent = i < store.state[keys.s_current_task_index] ? '🟢': '⚪'; // If not undefined.
                        tag.appendChild(div);
                    }
                }
            }

            _dataset() {
                let tag_source_model = this.content.querySelector('#source-model');
                tag_source_model.textContent = '';
                let tag_explanation = this.content.querySelector('#explanation');
                tag_explanation.textContent = '';
                let task = this.current_view.tasks[store.state[keys.s_current_task_index]];
                
                if (task.source) {
                    let div = this._createCard('Source', task.source.label, task.source.is_image);
                    tag_source_model.appendChild(div);
                }
                if (task.model) {
                    let div = this._createCard('Model', task.source.label, task.source.is_image);
                    tag_source_model.appendChild(div);
                }
                if (task.explanations) {
                    if (task.explanations.length > 1) {
                        tag_explanation.classList.add('row-cols-sm-2');
                    }
                    let i = 1;
                    for (let item of task.explanations) {
                        let div = this._createCard(`Explanation #${i}`, item.label, item.is_image);
                        tag_explanation.appendChild(div);
                        i++;
                    }
                }
            }

            _desc() {
                let tag = this.content.querySelector('#desc');
                tag.textContent = `${this.current_view.desc}`;
            }

            _task() {
                let tag = this.content.querySelector('#task');
                let text = '';
                if (this.current_view.is_training) {
                    text = `Training task`;
                } else {
                    text = `Task n°${store.state[keys.s_current_experiment_index] + 1}`;
                }
                tag.textContent = text;
            }

            _timer() {
                if (this.current_time >= 0) {
                    let tag = this.content.querySelector('#timer');
                    tag.textContent = this.current_time.toFixed(2);
                    let delta_time = 1000;
                    this.timer_id = window.setInterval(() => {
                        this.current_time -= delta_time/1000;
                        tag.textContent = (Math.round(this.current_time * 100) / 100).toFixed(2);
                        if (this.current_time <= 0) {
                            /** @type {FormComponent} */
                            let form = this.content.querySelector('#form');
                            let responses = form.submit();
                            this._transition(responses, true);
                        }
                    }, delta_time);
                }
            }

            _transition(response, is_time_exceeded) {
                let submit_btn = this.content.querySelector('#submit-btn');
                submit_btn.removeEventListener('click', this._submit);

                clearInterval(this.timer_id);

                if (!this.current_view.is_training) {
                    store.dispatch(keys.a_update_experiment_completed, {response: response, time: Math.max(this.current_time, 0), is_time_exceeded: is_time_exceeded});
                }

                if (store.state[keys.s_current_task_index] + 1 >= this.current_view.tasks.length) {
                    store.dispatch(keys.a_update_current_task_index, {index: 0});
                    if (!this.current_view.is_training) {
                        store.dispatch(keys.a_update_experiment_index, {index: store.state[keys.s_current_experiment_index] + 1});
                    }
                    nextView();
                } else {
                    store.dispatch(keys.a_update_current_task_index, {index: store.state[keys.s_current_task_index] + 1});
                    this._init();
                }      
            }

            _form() {
                /** @type {FormComponent} */
                let form = this.content.querySelector('#form');
                form.unchecked();
            }

            _init() {
                this.current_time = this.current_view.timer;
                this._initEvents();
                this._currentStatus();
                this._desc();
                this._task();
                this._dataset();
                this._timer();
                this._form();
            }
            
            _submit() {
                /** @type {FormComponent} */
                let form = this.content.querySelector('#form');
                let responses = form.submit();
                if (responses.some(bool => bool)) {
                    // @TODO : Afficher une indication.
                    this._transition(responses, false);
                }
            }

            _initEvents() {
                let submit_btn = this.content.querySelector('#submit-btn');
                submit_btn.addEventListener('click', this._submit);                
            }
            
            connectedCallback () {
                /* Guard */
                let is_legit = guardView(PAGE_NAMES.EXPE);
                if (!is_legit) { return; }
                /* Html */
                this.appendChild(TEMPLATE.content.cloneNode(true));
                /* Attributes */
                this.content = this.querySelector('#main-page');
                /** @type {Experiment} */
                this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                this.current_time = this.current_view.timer;
                /** @type {number | undefined} */
                this.timer_id = undefined;
                this._submit = this._submit.bind(this); // Bind to remove listener (otherwise bind create a new function).
                /* Methods */
                this._init();
            }
          
            disconnectedCallback () {
                if(this.timer_id) {
                    clearInterval(this.timer_id);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
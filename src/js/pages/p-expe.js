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
    const TAG_IDS = {
        alert_placeholder: 'alert-placeholder',
        current_status: 'current-status',
        desc_text: 'desc-text',
        explanation: 'explanation',
        form: 'form',
        main_page: 'main-page',
        next_btn: 'next-btn',
        source_model: 'source-model',
        submit_btn: 'submit-btn',
        task_title_container: 'task-title-container',
        task_title: 'task-title',
        timer: 'timer',
    };

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

            <div id="${TAG_IDS.main_page}" class="d-flex flex-column justify-content-center">

                <div class="container container-decoration mt-2 p-2" id="${TAG_IDS.task_title_container}">
                    <h3 id="${TAG_IDS.task_title}" class="container">Task</h3>
    
                    <div id="${TAG_IDS.desc_text}" class="container fs-5">
                        Rule: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
                
                <div id="${TAG_IDS.alert_placeholder}" class="container"></div>

                <div class="container mt-2">
                    <div class="row">
                        <div class="col-sm-9">
                            <div class="row" id="${TAG_IDS.source_model}">
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
                            <div class="row card-explanation mb-2" id="${TAG_IDS.explanation}">
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
                            <div id="${TAG_IDS.current_status}" class="container container-decoration d-flex justify-content-center"></div>

                            <div id="${TAG_IDS.timer}" class="text-center fs-2 my-2"></div>

                            <${COMPONENT_NAMES.FORM} id="${TAG_IDS.form}"></${COMPONENT_NAMES.FORM}>

                            <button id="${TAG_IDS.submit_btn}" type="button" class="btn btn-info btn-lg text-uppercase w-100 mt-4">Submit</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            /**
             * Check the validity of the form.
             * @param {Array<number>} answers
             * @returns boolean
             */
            _checkAnswers(answers) {
                let expected = this.current_view.tasks[store.state[keys.s_current_task_index]].expected;
                if (expected.length != answers.length) {
                    return false;
                }
                let not_correct_answers = answers.filter(response => !expected.includes(response));
                return not_correct_answers.length == 0 ? true: false;
            }

            /**
             * @param {Array} answers 
             */
            _createAlert(answers) {
                let is_correct = this._checkAnswers(answers);
                let alert_container = this._getElementById(TAG_IDS.alert_placeholder);
                alert_container.textContent = '';
                let alert = document.createElement('div');
                alert.classList.add('alert', is_correct ? 'alert-success': 'alert-danger', 'my-3');
                alert.setAttribute('role', 'alert');
                let alert_title = document.createElement('h5');
                alert_title.textContent = `${is_correct ? this.current_view.feedback_answer_correct: this.current_view.feedback_answer_wrong}`;
                alert.appendChild(alert_title);
                if (!is_correct && this.current_view._feedback_answer_show_expected) {
                    let alert_hr = document.createElement('hr');
                    alert.appendChild(alert_hr);
                    let alert_expected = document.createElement('div');
                    let expected = this.current_view.tasks[store.state[keys.s_current_task_index]].expected;
                    let expected_answers = expected.map(i => this.current_view.question.answers[i]);
                    alert_expected.textContent = `${this.current_view._feedback_answer_expected_text} ${expected_answers.join(', ')}`;
                    alert.appendChild(alert_expected);
                }
                alert_container.appendChild(alert);
            }

            /**
             * @param {string} body_title_text 
             * @param {string} text 
             * @param {boolean} is_image 
             * @returns HTMLDivElement
             */
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
                body_title.classList.add('card-title', 'text-center');
                body_title.textContent = body_title_text;
                card_body.appendChild(body_title);
                card.appendChild(card_body);
                col.appendChild(card);
                return col;
            }

            /**
             * Display, if requested, the progress status of the task.
             */
            _currentStatus() {
                if (this.current_view.show_progression_bar) {
                    let tag = this._getElementById(TAG_IDS.current_status);
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

            /**
             * Fill in the task data.
             */
            _dataset() {
                let tag_source_model = this._getElementById(TAG_IDS.source_model);
                tag_source_model.textContent = '';
                let tag_explanation = this._getElementById(TAG_IDS.explanation);
                tag_explanation.textContent = '';
                let task = this.current_view.tasks[store.state[keys.s_current_task_index]];
                
                if (task.source) {
                    let div = this._createCard(task.source.title, task.source.label, task.source.is_image);
                    tag_source_model.appendChild(div);
                }
                if (task.model) {
                    let div = this._createCard(task.model.title, task.model.label, task.model.is_image);
                    tag_source_model.appendChild(div);
                }
                if (task.explanations) {
                    if (task.explanations.length > 1) {
                        tag_explanation.classList.add('row-cols-sm-2');
                    }
                    let i = 1;
                    for (let item of task.explanations) {
                        let div = this._createCard(item.title, item.label, item.is_image);
                        tag_explanation.appendChild(div);
                        i++;
                    }
                }
            }

            /**
             * Sets the description for the task.
             */
            _desc() {
                let tag = this._getElementById(TAG_IDS.desc_text);
                tag.textContent = `${this.current_view.desc}`;
            }

            /**
             * @param {string} id 
             * @returns {HTMLElement}
             */
            _getElementById(id) {
                return this.content.querySelector(`#${id}`);
            }

            /**
             * Handles the next button based on the feedback required.
             */
            _nextButton() {
                let submit_btn = this._getElementById(TAG_IDS.submit_btn);
                submit_btn.removeAttribute('disabled');
                let previous_next_btn = this._getElementById(TAG_IDS.next_btn);
                if (previous_next_btn) {
                    previous_next_btn.parentElement.removeChild(previous_next_btn);
                }
                let next_btn = document.createElement('button');
                next_btn.id = TAG_IDS.next_btn;
                next_btn.setAttribute('type', 'button');
                next_btn.classList.add('btn', 'btn-primary', 'btn-lg', 'text-uppercase', 'w-100', 'mt-4');
                next_btn.textContent = 'Next';
                next_btn.addEventListener('click', () => {
                    this._transition();
                });
                next_btn.style.display = 'none';
                submit_btn.parentElement.appendChild(next_btn);
            }

            /**
             * Empty the alert container.
             */
            _resetAlert() {
                let alert_container = this._getElementById(TAG_IDS.alert_placeholder);
                alert_container.textContent = '';
            }

            /**
             * Uncheck the form.
             */
            _resetForm() {
                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                form.enable();
                form.unchecked();
            }

            /**
             * Function called when the task is submitted.
             * @param {boolean} is_time_exceeded 
             */
            _submit(is_time_exceeded = false) {
                clearInterval(this.timer_id); 

                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                let answers = form.submit();
                // At least one answer.
                if (answers.length > 0 && answers[0].length > 0) {
                    // Save answers if not training.
                    if (!this.current_view.is_training) {
                        store.dispatch(keys.a_update_save, {
                            [`task_${store.state[keys.s_current_task_index]}`]: {
                                answers: answers,
                                time: this.current_time,
                                is_time_exceeded: is_time_exceeded,
                                order_index: this.current_view.order[store.state[keys.s_current_task_index]]
                            }
                        });
                    }                    

                    if (this.current_view.feedback_answer_activated) {
                        this._createAlert(answers[0]);
                        /** @type {HTMLElement} */
                        let next_btn = this._getElementById(TAG_IDS.next_btn);
                        next_btn.style.display = 'block';
                        let submit_btn = this._getElementById(TAG_IDS.submit_btn);
                        submit_btn.setAttribute('disabled', '');
                        /** @type {FormComponent} */
                        let form = this.content.querySelector(`#${TAG_IDS.form}`);
                        form.disable();
                    } else {
                        this._transition();
                    }                    
                }
            }

            /**
             * Manage the task title and description container.
             */
            _task() {
                let tag = this._getElementById(TAG_IDS.task_title);
                tag.textContent = this.current_view.title;
                let tag_desc_title = this._getElementById(TAG_IDS.desc_text);

                if (!tag.textContent && !tag_desc_title.textContent) {
                     let title_task_container = this._getElementById(TAG_IDS.task_title_container);
                     if (title_task_container) {
                        title_task_container.style.display = 'none';
                     }
                }
            }

            /**
             * Displays a timer if required.
             */
            _timer() {
                let tag = this._getElementById(TAG_IDS.timer);
                
                if (this.current_view.timer >= 0) {
                    tag.textContent = this.current_view.timer.toFixed(2);
                }

                let delta_time = 1000;
                this.timer_id = window.setInterval(() => {
                        this.current_time += delta_time / 1000;
                        if (this.current_view.timer >= 0) {
                            tag.textContent = (Math.round((this.current_view.timer - this.current_time) * 100) / 100).toFixed(2);
                            if (this.current_time >= this.current_view.timer) {
                                this._submit(true);
                            }
                        }
                    }, delta_time);
            }

            /**
             * Transitioning to a new task or view.
             */
            _transition() {
                if (store.state[keys.s_current_task_index] + 1 >= this.current_view.tasks.length) {
                    store.dispatch(keys.a_update_current_task_index, {index: 0});
                    nextView();
                } else {
                    store.dispatch(keys.a_update_current_task_index, {index: store.state[keys.s_current_task_index] + 1});
                    this._init();
                }      
            }

            _init() {
                this.current_time = 0;
                this._currentStatus();
                this._dataset();
                this._desc();
                this._nextButton();
                this._resetAlert();
                this._resetForm();
                this._task();
                this._timer();
            }

            _initEvents() {
                let submit_btn = this._getElementById(TAG_IDS.submit_btn);
                if (submit_btn) {
                    submit_btn.addEventListener('click', () => {
                        this._submit();
                    });
                }
            }
            
            connectedCallback () {
                /* Guard */                
                let is_legit = guardView(PAGE_NAMES.EXPE);
                if (!is_legit) { return; }

                /* Html */
                this.appendChild(TEMPLATE.content.cloneNode(true));

                /* Attributes */
                /** @type {HTMLElement} */
                this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                /** @type {Experiment} */
                this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                this.current_time = 0;
                /** @type {number | undefined} */
                this.timer_id = undefined;

                /* Methods */
                this._init();
                this._initEvents();
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
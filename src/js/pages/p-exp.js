// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { Experiment } from 'JS/store/modules/view-classes';
/* Types */
import { FormComponent } from 'JS/components/wc-form';

try {
    const TAG_IDS = {
        alert_placeholder: 'alert-placeholder',
        alert_timer_placeholder: 'alert-timer-placeholder',
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
                    font-size: 1.2rem;
                }
                .container-decoration {
                    border-radius: 1rem;
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
                    max-width: 40vw;
                    margin: auto;                    
                }
            </style>

            <div id="${TAG_IDS.main_page}" class="d-flex flex-column justify-content-center">

                <div class="container-decoration mx-4 px-4 py-2" id="${TAG_IDS.task_title_container}">
                    <div id="${TAG_IDS.task_title}">Task view</div>
    
                    <div id="${TAG_IDS.desc_text}">
                        There was an error when parsing the JSON entry, so the page cannot be rendered
                    </div>
                </div>
                
                <div id="${TAG_IDS.alert_placeholder}" class="mx-4"></div>

                <div id="${TAG_IDS.alert_timer_placeholder}" class="mx-4"></div>

                <div class="">
                    <div id="${TAG_IDS.current_status}" class="mx-4 m-0 container-decoration d-flex justify-content-center"></div>

                    <div class="mx-4 container-decoration">
                        <div id="${TAG_IDS.timer}" class="text-center fs-1 mt-2"></div>
                    </div>

                    <div class="row mt-1 mx-4">
                        <div class="col px-0">
                            <div class="d-flex align-items-stretch mt-2" style="gap:1rem" id="${TAG_IDS.source_model}">
                                <!-- <div class="col-sm">
                                    <div class="card h-100">
                                        <img src="assets/datasets/single-kingfisher-bird_xai.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-footer text-body-secondary text-center">
                                            Source image
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card h-100">
                                        <div class="card-body">
                                            <p class="card-text d-flex flex-column align-items-center justify-content-center h-100">
                                                Une explication à propos de la donnée.
                                            </p>
                                        </div>
                                        <div class="card-footer text-body-secondary text-center">
                                            Explanation
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="card h-100">
                                        <img src="assets/datasets/single-kingfisher-bird_xai.jpg" class="card-img-top icon" alt="...">
                                        <div class="card-footer text-body-secondary text-center">
                                            Model
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2 mx-4">
                        <div class="col-sm px-0">
                            <${COMPONENT_NAMES.FORM} id="${TAG_IDS.form}"></${COMPONENT_NAMES.FORM}>
                        </div>
                        <div class="px-0">
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
             * @param {Array<number|string>} answers
             * @returns {boolean}
             */
            _checkAnswers(answers) {
                let expected = this.current_view.tasks[store.state[keys.s_current_task_index]].expected;
                console.log(expected, answers);
                
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
                alert.classList.add('alert', is_correct ? 'alert-success': 'alert-danger', 'm-0', 'mt-2');
                alert.setAttribute('role', 'alert');
                let alert_title = document.createElement('h5');
                alert_title.textContent = `${is_correct ? this.current_view.feedback_answer_correct: this.current_view.feedback_answer_wrong}`;
                alert.appendChild(alert_title);
                if (!is_correct && this.current_view._feedback_answer_show_expected) {
                    let alert_hr = document.createElement('hr');
                    alert_hr.classList.add('my-0')
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
             * @param {number} remaining_time 
             */
            _createAlertTimer(remaining_time) {
                let alert_container = this._getElementById(TAG_IDS.alert_timer_placeholder);
                alert_container.textContent = '';
                let alert = document.createElement('div');
                alert.classList.add('alert', 'alert-danger', 'my-3');
                alert.setAttribute('role', 'alert');
                alert.textContent = `You did not answer on time. The next view will appear in ${remaining_time} seconds.`;
                alert_container.appendChild(alert);
            }

            /**
             * @param {string} body_title_text 
             * @param {string} text 
             * @param {boolean} is_image 
             * @returns HTMLDivElement
             */
            _createCard(body_title_text, text, is_image, only_source = false) {
                let col = document.createElement('div');
                if (!only_source) {
                    col.classList.add('col');
                } else {
                    col.classList.add('col-6');
                }
                let card = document.createElement('div');
                card.classList.add('card', 'h-100');
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
                    body_text.classList.add('card-text', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'h-100');
                    body_text.textContent = text;
                    card_body.appendChild(body_text);
                    card.appendChild(card_body);
                }
                let body_title = document.createElement('div');
                body_title.classList.add('card-footer', 'text-body-secondary', 'text-center', 'fw-normal');
                body_title.textContent = body_title_text;
                card.appendChild(body_title);
                col.appendChild(card);
                return col;
            }

            /**
             * Display, if requested, the progress status of the task.
             */
            _currentStatus() {
                if (this.current_view.show_progression_bar) {
                    let tag = this._getElementById(TAG_IDS.current_status);
                    tag.classList.add('p-2', 'mt-2');
                    tag.textContent = '';
                    for (let i = 0; i < this.current_view.tasks.length; i++) {
                        let div = document.createElement('div');
                        div.classList.add('mr-1');
                        div.textContent = i < store.state[keys.s_current_task_index] ? '🔵': '⚪'; // If not undefined.
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
                // let tag_explanation = this._getElementById(TAG_IDS.explanation);
                // tag_explanation.textContent = '';
                let task = this.current_view.tasks[store.state[keys.s_current_task_index]];
                
                if (task.source) {
                    let div = this._createCard(task.source.title, task.source.label, task.source.is_image, (task.model == undefined && task.explanations.length == 0) ? true: false);
                    tag_source_model.appendChild(div);
                }
                if (task.model) {
                    let div = this._createCard(task.model.title, task.model.label, task.model.is_image);
                    tag_source_model.appendChild(div);
                }
                if (task.explanations) {
                    // if (task.explanations.length > 1) {
                    //     tag_explanation.classList.add('row-cols-sm-2');
                    // }
                    let i = 1;
                    for (let item of task.explanations) {
                        let div = this._createCard(item.title, item.label, item.is_image);
                        // tag_explanation.appendChild(div);
                        tag_source_model.appendChild(div);
                        i++;
                    }
                }
            }

            /**
             * Sets the description for the task.
             */
            _desc() {
                let tag = this._getElementById(TAG_IDS.desc_text);
                tag.innerHTML = `${this.current_view.desc}`;
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

            _observer(mutationsList) {
                for(const mutation of mutationsList) { // List of detected mutations.
                    if (mutation.type === 'attributes') { // Check if it's an attribute modification.
                        if (mutation.attributeName == 'data-response') {
                            this._submit();
                        }
                    }
                }
            }

            _observing() {
                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                this.observer.observe(form, { attributes: true });
            }

            /**
             * Empty the alert container.
             */
            _resetAlert() {
                let alert_container = this._getElementById(TAG_IDS.alert_placeholder);
                alert_container.textContent = '';
                let alert_timer_container = this._getElementById(TAG_IDS.alert_timer_placeholder);
                alert_timer_container.textContent = '';
            }

            /**
             * Uncheck the form.
             */
            _resetForm() {
                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                form.enable();
                form.unchecked();
                form.style.display = 'block';
            }

            /**
             * Function called when the task is submitted.
             * @param {boolean} is_time_exceeded 
             */
            _submit(is_time_exceeded = false) {
                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                let answers = form.submit();                
                // At least one answer.
                if (!form.someEmptyQuestion() || (this.current_view.timer >= 0 && (this.current_time / 1000) >= this.current_view.timer)) {
                    clearInterval(this.timer_id);
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
                    
                    let checked_answers = this._checkAnswers(answers[0]);
                    if (checked_answers) {
                        this.good_answers += 1;
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
                        form.style.display = 'none';
                        this.observer && this.observer.disconnect();
                    } else {
                        if (is_time_exceeded && this.current_view.time_exceeded_timer > 0) {
                            this._createAlertTimer(this.current_view.time_exceeded_timer);
                            this.time_exceeded_timer = window.setInterval(() => {
                                this.time_exceeded_current_time += 1;
                                this._createAlertTimer(this.current_view.time_exceeded_timer - this.time_exceeded_current_time);
                            }, 1000);
                            setTimeout(() => {
                                clearInterval(this.time_exceeded_timer);
                                this._transition();
                            }, this.current_view.time_exceeded_timer * 1000);
                        } else {
                            this._transition();
                        }
                    }                    
                }
            }

            /**
             * Manage the task title and description container.
             */
            _task() {
                let tag = this._getElementById(TAG_IDS.task_title);
                tag.innerHTML = this.current_view.title;
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
                    tag.textContent = this.current_view.timer.toFixed(0);
                    tag.classList.remove('text-danger');
                }

                let delta_time = 100;
                this.timer_id = window.setInterval(() => {
                    this.current_time += delta_time;
                    let current_time_second = this.current_time / 1000;

                    let remaining_time = this.current_view.timer - current_time_second;
                    
                    if (remaining_time <= 5) {
                        tag.classList.add('text-danger');
                    }
                    if (this.current_view.timer >= 0) {
                        if (current_time_second % 1 == 0) {
                            tag.textContent = (Math.round(remaining_time * 100) / 100).toFixed(0);
                        }
                        if (current_time_second >= this.current_view.timer) {
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
                    store.dispatch(keys.a_update_experiment_scores, this.good_answers / this.current_view.tasks.length);
                    nextView();
                } else {
                    store.dispatch(keys.a_update_current_task_index, {index: store.state[keys.s_current_task_index] + 1});
                    this._init();
                }      
            }

            _init() {
                this.current_time = 0;
                this.time_exceeded_current_time = 0;
                this._currentStatus();
                this._dataset();
                this._desc();
                this._nextButton();
                this._resetAlert();
                this._resetForm();
                this._task();
                window.addEventListener('load', () => {
                     this._timer();
                });
                this.observer && this._observing();
            }

            _initEvents() {
                /** @type {FormComponent} */
                let form = this.content.querySelector(`#${TAG_IDS.form}`);
                
                if (form.questions.length == 0) {
                    return;
                }

                let submit_btn = this._getElementById(TAG_IDS.submit_btn);
                if (form.questions[0].type == 'button') {
                    this.observer = new MutationObserver(this._observer.bind(this));
                    this._observing();
                    submit_btn.style.display = 'none';
                } else {
                    if (submit_btn) {
                        submit_btn.addEventListener('click', () => {
                            this._submit();
                        });
                        submit_btn.style.display = 'block';
                    }
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
                this.time_exceeded_current_time = 0;
                this.good_answers = 0;
                /** @type {number | undefined} */
                this.timer_id = undefined;
                /** @type {number | undefined} */
                this.time_exceeded_timer = undefined;
                this.observer = undefined;
                /* Methods */
                this._init();
                this._initEvents();
            }
          
            disconnectedCallback () {
                if(this.timer_id) {
                    clearInterval(this.timer_id);
                }
                this.time_exceeded_timer && clearInterval(this.time_exceeded_timer);
                this.observer && this.observer.disconnect();
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
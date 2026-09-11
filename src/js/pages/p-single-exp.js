// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { SingleExperiment } from 'JS/store/modules/view-classes';

try {
    const TAG_IDS = {
        main_page: 'main-page',
        image: 'image-div',
        labels_list: 'labels-list-div',
        next_btn: 'next-btn',
        timer: 'timer-div',
        error: 'error-div',
        desc: 'desc-div',
        confidence: 'confidence-div',
        slider: 'slider-input',
        slider_value: 'slider-value-span',
        rewards: 'rewards-div',
        rewards_correct: 'rewards-correct-span',
        rewards_incorrect: 'rewards-incorrect-span'
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.SINGLE_EXPE;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                .image-container {
                    width: 300px;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .confidence-value {
                    font-weight: bold;
                    min-width: 40px;
                    text-align: center;
                }
            </style>

            <div id="${TAG_IDS.main_page}" class="container-fluid vh-100 d-flex justify-content-center align-items-center">
                <div class="container">

                    <h1 id="${TAG_IDS.desc}" class="mb-5 text-center">
                        Please select the correct category for the image
                    </h1>

                    <div class="row g-4 align-items-stretch mt-5">

                        <!-- Image -->
                        <div class="col-12 col-lg-5 d-flex align-items-center justify-content-center">
                            <div id="${TAG_IDS.image}" class="image-container"></div>
                        </div>

                        <!-- Liste des catégories -->
                        <div class="col-12 col-lg-2">
                            <b>Please select the correct category: </b>
                            <form id="${TAG_IDS.labels_list}">
                            </form>
                        </div>


                        <!-- Confidence + Validation -->
                        <div class="col-12 col-lg-5 d-flex flex-column justify-content-between">

                            <div id="${TAG_IDS.confidence}">
                                <h4 class="text-center mb-4">
                                    Answer Confidence
                                </h4>
                                <div class="d-flex align-items-center gap-3 mb-4">
                                    <span>0</span>
                                    <input
                                        type="range"
                                        class="form-range"
                                        min="0"
                                        max="100"
                                        value="50"
                                        id="${TAG_IDS.slider}"
                                    >
                                    <span>100</span>
                                    <span id="${TAG_IDS.slider_value}" class="confidence-value">
                                        50
                                    </span>
                                </div>
                            </div>

                            <div id="${TAG_IDS.rewards}" class="text-body-secondary fs-5 d-none">
                                <div>Correct: <span id="${TAG_IDS.rewards_correct}">0</span></div>
                                <div>Incorrect: <span id="${TAG_IDS.rewards_incorrect}">0</span></div>
                            </div>

                            <div class="d-grid">
                                <button id="${TAG_IDS.next_btn}" class="btn btn-outline-secondary btn-lg">
                                    Validate
                                </button>
                            </div>

                        </div>

                    </div>

                    <div id="${TAG_IDS.timer}" class="text-center mt-5 fs-3"></div>

                    <div id="${TAG_IDS.error}" class="text-center text-danger"></div>

                </div>
            </div>
        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _clear_error() {
                let error_tag = this.content?.querySelector(`#${TAG_IDS.error}`);
                if (error_tag) error_tag.innerHTML = '';
            }

            _image() {
                let image_tag = this.content?.querySelector(`#${TAG_IDS.image}`);
                if (image_tag && this.current_view?.image) {
                    image_tag.innerHTML = `<img src="${this.current_view.image}" class="icon rounded img-thumbnail" alt="Sample Image">`;
                }
            }

            _labels() {
                let labels_tag = this.content?.querySelector(`#${TAG_IDS.labels_list}`);
                if (!labels_tag || !this.current_view?.labels) return;

                labels_tag.innerHTML = '';
                for (let i = 0; i < this.current_view.labels.length; i++) {
                    let container = document.createElement('div');
                    container.classList.add('form-check');

                    let input = document.createElement('input');
                    input.classList.add('form-check-input');
                    input.type = 'radio';
                    input.name = 'labels';
                    input.id = `label${i + 1}`;
                    input.value = i.toString();

                    container.appendChild(input);

                    let label_tag = document.createElement('label');
                    label_tag.classList.add('form-check-label');
                    label_tag.htmlFor = `label${i + 1}`;
                    label_tag.textContent = this.current_view.labels[i];

                    container.appendChild(label_tag);
                    labels_tag.appendChild(container);
                }
            }

            _desc() {
                let desc_tag = this.content?.querySelector(`#${TAG_IDS.desc}`);
                if (desc_tag && this.current_view?.desc) {
                    desc_tag.innerHTML = this.current_view.desc;
                }
            }

            _correct_rewards(cts, confidence) {
                return (cts - 0.5 * (cts - confidence / 100 * cts)).toFixed(2);
            }

            _incorrect_rewards(cts, confidence) {
                return (cts - 0.5 * (cts + confidence / 100 * cts)).toFixed(2);
            }
            _secure_timer() {
                if (this.current_view?.timer >= 0) {
                    let tag = this.content?.querySelector(`#${TAG_IDS.timer}`);
                    if (tag) {
                        tag.textContent = this.current_view.timer.toFixed(0);
                        tag.classList.remove('text-danger');
                    }

                    let image_container = this.content?.querySelector(`#${TAG_IDS.image}`);
                    let img = image_container?.querySelector('img');

                    // If an image exists, wait for decode; otherwise start timer immediately
                    if (img && typeof img.decode === 'function') {
                        img.decode()
                            .then(() => this._timer())
                            .catch((err) => {
                                console.warn('Image decode failed, starting timer anyway:', err);
                                this._timer();
                            });
                    } else {
                        this._timer();
                    }
                }
            }
            _submit() {
                /** @type {HTMLFormElement | null} */
                let form = this.content?.querySelector(`#${TAG_IDS.labels_list}`);
                if (!form) return;

                let form_data = new FormData(form);

                if (form_data.get('labels') == null && !this.time_exceeded_timer) {
                    let error_tag = this.content?.querySelector(`#${TAG_IDS.error}`);
                    if (error_tag) error_tag.textContent = 'Please select a label';
                    return;
                }

                let selected_label = form_data.get('labels') == null ? null : parseInt(form_data.get('labels'));

                // Accuracy score: 1 if user selected truth, otherwise 0
                let is_correct = (selected_label === this.current_view?.truth) ? 1 : 0;

                let confidence = -1;
                if (this.current_view?.confidence) {
                    let slider = this.content?.querySelector(`#${TAG_IDS.slider}`);
                    if (slider) confidence = parseInt(slider.value);
                }

                /* Save */
                store.dispatch(keys.a_update_save, {
                    instances: [{
                        answers: selected_label,
                        confidence: confidence,
                        time: this.current_time,
                        is_time_exceeded: this.time_exceeded_timer,
                        expected: this.current_view?.truth
                    }]
                });

                // Dispatch binary accuracy score (1 or 0)
                store.dispatch(keys.a_update_experiment_scores, is_correct);
                nextView();
            }

            _timer() {
                function timer_text(time) {
                    return `Time left: ${time} seconds`;
                }
                let tag = this.content?.querySelector(`#${TAG_IDS.timer}`);
                
                if (this.current_view?.timer >= 0 && tag) {
                    tag.textContent = timer_text(this.current_view.timer.toFixed(0));
                    tag.classList.remove('text-danger');
                }

                let delta_time = 100;
                this.timer_id = window.setInterval(() => {
                    this.current_time += delta_time;
                    let current_time_second = this.current_time / 1000;

                    let remaining_time = (this.current_view?.timer || 0) - current_time_second;
                    
                    if (remaining_time <= 3 && tag) {
                        tag.classList.add('text-danger');
                    }
                    if (this.current_view?.timer >= 0) {
                        if (current_time_second % 1 == 0 && tag) {
                            tag.textContent = timer_text((Math.round(remaining_time * 100) / 100).toFixed(0));
                        }
                        if (current_time_second >= this.current_view.timer) {
                            this.time_exceeded_timer = true;
                            this._submit();
                        }
                    }
                }, delta_time);
            }            

            _init() {
                this.timer_id && clearInterval(this.timer_id);
                this.current_time = 0;
                this.time_exceeded_timer = false;
                this._clear_error();
                this._desc();
                this._image();
                this._labels();
                this._secure_timer();
            }

            _init_events() {
                let next_btn = this.content?.querySelector(`#${TAG_IDS.next_btn}`);
                next_btn?.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._submit();
                });
                
                if (this.current_view?.show_rewards) {
                    this.content?.querySelector(`#${TAG_IDS.rewards}`)?.classList.toggle('d-none');
                }
                
                if (this.current_view?.confidence) {
                    const slider = this.content?.querySelector(`#${TAG_IDS.slider}`);
                    const value = this.content?.querySelector(`#${TAG_IDS.slider_value}`);

                    if (slider && value) {
                        const REWARD_CTS = 3;
                        const correct_rewards = this.content?.querySelector(`#${TAG_IDS.rewards_correct}`);
                        const incorrect_rewards = this.content?.querySelector(`#${TAG_IDS.rewards_incorrect}`);

                        if (correct_rewards && incorrect_rewards) {
                            correct_rewards.textContent = this._correct_rewards(REWARD_CTS, parseInt(slider.value));
                            incorrect_rewards.textContent = this._incorrect_rewards(REWARD_CTS, parseInt(slider.value));
                        }

                        slider.addEventListener('input', () => {
                            value.textContent = slider.value;

                            if (this.current_view?.show_rewards && correct_rewards && incorrect_rewards) {
                                correct_rewards.textContent = this._correct_rewards(REWARD_CTS, parseInt(slider.value));
                                incorrect_rewards.textContent = this._incorrect_rewards(REWARD_CTS, parseInt(slider.value));
                            }
                        });
                    }
                } else {
                    let conf_div = this.content?.querySelector(`#${TAG_IDS.confidence}`);
                    if (conf_div) conf_div.innerHTML = '';
                }
            }
         
            connectedCallback() {
                /* Guard */                
                let is_legit = guardView(PAGE_NAME);
                if (!is_legit) { 
                    console.error(`guardView rejected rendering for page: ${PAGE_NAME}`);
                    return; 
                }

                this.appendChild(TEMPLATE.content.cloneNode(true));
                /** @type {HTMLElement | null} */
                this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                
                /** @type {SingleExperiment} */
                this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                
                /** @type {number | undefined} */
                this.timer_id = undefined;
                this.current_time = 0;
                /** @type {boolean} */
                this.time_exceeded_timer = false;

                this._init();
                this._init_events();
            }
          
            disconnectedCallback() {
                if (this.timer_id) {
                    clearInterval(this.timer_id);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
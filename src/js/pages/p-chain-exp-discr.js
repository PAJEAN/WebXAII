// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { ChainExperimentDiscr } from 'JS/store/modules/view-classes';

try {
    const TAG_IDS = {
        main_page: 'main-page',
        image: 'image-div',
        image_clarity: 'image-clarity-p',
        labels_list: 'labels-list-div',
        next_btn: 'next-btn',
        timer: 'timer-div',
        error: 'error-div',
        desc: 'desc-div',
        confidence: 'confidence-div',
        likert_form: 'likert-confidence-form',
        rewards: 'rewards-div',
        rewards_header: 'rewards-header-p',
        rewards_correct: 'rewards-correct-span',
        rewards_incorrect: 'rewards-incorrect-span'
    };

    const LIKERT_MAP = {
        1: { pct: 0, label: 'Very Low' },
        2: { pct: 17, label: 'Low' },
        3: { pct: 33, label: 'Moderately Low' },
        4: { pct: 50, label: 'Moderate' },
        5: { pct: 67, label: 'Moderately High' },
        6: { pct: 83, label: 'High' },
        7: { pct: 100, label: 'Very High' }
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.CHAIN_EXPE_DISCR;

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

                .likert-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 6px;
                }

                .likert-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 0.75rem;
                    text-align: center;
                }

                .likert-option input[type="radio"] {
                    cursor: pointer;
                    width: 1.15rem;
                    height: 1.15rem;
                }
            </style>

            <div id="${TAG_IDS.main_page}" class="container-fluid vh-100 d-flex justify-content-center align-items-center">
                <div class="container">
                    <h1 id="${TAG_IDS.desc}" class="mb-5 text-center">
                        Second Task: Please select the correct category for the image
                    </h1>

                    <div id="task-content-row" class="row g-4 align-items-stretch mt-5">

                        <!-- Image + Clarity Level -->
                        <div class="col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center">
                            <div id="${TAG_IDS.image}" class="image-container">
                                <img src="assets/datasets/felipe/dog.JPEG" alt="Image à classifier">
                            </div>
                            <p id="${TAG_IDS.image_clarity}" class="fw-bold mt-2 text-center text-secondary mb-0"></p>
                        </div>

                        <!-- Liste des catégories -->
                        <div class="col-12 col-lg-2">
                            <b>Please select the correct category: </b>
                            <form id="${TAG_IDS.labels_list}">
                            </form>
                        </div>

                        <!-- Confiance (7-point Likert) + validation -->
                        <div class="col-12 col-lg-5 d-flex flex-column justify-content-between">

                            <div id="${TAG_IDS.confidence}">
                                <h4 class="text-center mb-3">
                                    Answer Confidence
                                </h4>
                                <b style='color:red;' class="d-block text-center mb-3">Please select your confidence level</b>
                                
                                <form id="${TAG_IDS.likert_form}" class="likert-container mb-4">
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-1" value="1" checked>
                                        <label for="likert-1" class="mt-1">Very Low<br>(0%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-2" value="2">
                                        <label for="likert-2" class="mt-1">Low<br>(17%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-3" value="3">
                                        <label for="likert-3" class="mt-1">Mod. Low<br>(33%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-4" value="4">
                                        <label for="likert-4" class="mt-1">Moderate<br>(50%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-5" value="5">
                                        <label for="likert-5" class="mt-1">Mod. High<br>(67%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-6" value="6">
                                        <label for="likert-6" class="mt-1">High<br>(83%)</label>
                                    </div>
                                    <div class="likert-option">
                                        <input type="radio" name="likert_val" id="likert-7" value="7">
                                        <label for="likert-7" class="mt-1">Very High<br>(100%)</label>
                                    </div>
                                </form>
                            </div>

                            <div id="${TAG_IDS.rewards}" class="text-body-secondary fs-5 d-none mb-3 text-center">
                                <p id="${TAG_IDS.rewards_header}" style='color:red;' class="mb-1"></p>
                                <div>Correctly: <span id="${TAG_IDS.rewards_correct}"></span></div>
                                <div>Incorrectly: <span id="${TAG_IDS.rewards_incorrect}"></span></div>
                            </div>

                            <div class="d-grid">
                                <button id="${TAG_IDS.next_btn}" class="btn btn-outline-secondary btn-lg">
                                    Validate
                                </button>
                            </div>

                        </div>

                    </div>

                    <div id="${TAG_IDS.timer}" class="text-center mt-5 fs-3"></div>

                    <div id="${TAG_IDS.error}" class="text-center text-danger mt-2"></div>

                </div>
            </div>

        `;

        const defineElement = () => {
            class ChainExperimentDiscrElement extends HTMLElement {
                constructor() {
                    super();
                    this.correct_step_index = -1;
                    this.total_earned = 0;
                    this.total_max = 0;
                    /** @type {number | undefined} */
                    this.timer_id = undefined;
                    this.current_time = 0;
                    this.time_exceeded_timer = false;
                    /** @type {number} Persists selected Likert point (1 through 7) across steps */
                    this.last_likert_value = 1;
                }

                _get_reward_cts() {
                    return (this.current_view && typeof this.current_view.reward_cts === 'number') 
                        ? this.current_view.reward_cts 
                        : 0.03;
                }

                _is_training() {
                    return (this.current_view && this.current_view.is_training === true);
                }

                _clear_error() {
                    let error_tag = this.content.querySelector(`#${TAG_IDS.error}`);
                    if (error_tag) { error_tag.innerHTML = ''; }
                }

                _images() {
                    if (this.current_view.current_image_index >= this.current_view.images.length) {
                        this._finish_task();
                        return;
                    }

                    let images_tag = this.content.querySelector(`#${TAG_IDS.image}`);
                    images_tag.innerHTML = `<img src="${this.current_view.images[this.current_view.current_image_index]}" class="icon rounded img-thumbnail" alt="...">`;

                    let clarity_tag = this.content.querySelector(`#${TAG_IDS.image_clarity}`);
                    if (clarity_tag) {
                        const current_stage = this.current_view.current_image_index + 1;
                        const total_steps = this.current_view.images.length;
                        clarity_tag.textContent = `Clarity level ${current_stage}/${total_steps}`;
                    }
                }

                _labels() {
                    if (this.current_view.current_image_index >= this.current_view.images.length) { 
                        this._finish_task();
                        return;
                    }

                    let labels_tag = this.content.querySelector(`#${TAG_IDS.labels_list}`);
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
                    let desc_tag = this.content.querySelector(`#${TAG_IDS.desc}`);
                    if (desc_tag) { desc_tag.innerHTML = this.current_view.desc; }
                }

                /**
                 * Implements: Rwd = rwd_var + 0.5 * (-rwd_var + rwd_var * Conf) for y_hat = y
                 * @param {number} rwd_var 
                 * @param {number} confidence_pct 
                 */
                _correct_rewards(rwd_var, confidence_pct) {
                    const conf = confidence_pct / 100;
                    const reward_val = rwd_var + 0.5 * (-rwd_var + rwd_var * conf);
                    const pence_val = reward_val * 100;
                    return pence_val.toFixed(2);
                }

                /**
                 * Implements: Rwd = rwd_var + 0.5 * (-rwd_var - rwd_var * Conf) for y_hat != y
                 * @param {number} rwd_var 
                 * @param {number} confidence_pct 
                 */
                _incorrect_rewards(rwd_var, confidence_pct) {
                    const conf = confidence_pct / 100;
                    const reward_val = rwd_var + 0.5 * (-rwd_var - rwd_var * conf);
                    const pence_val = reward_val * 100;
                    return pence_val.toFixed(2);
                }

                _update_reward_displays(likert_val) {
                    if (!this.current_view.show_rewards) { return; }
                    
                    const confidence_pct = LIKERT_MAP[likert_val] ? LIKERT_MAP[likert_val].pct : 0;
                    const reward_cts = this._get_reward_cts();
                    const correct_rewards = this.content.querySelector(`#${TAG_IDS.rewards_correct}`);
                    const incorrect_rewards = this.content.querySelector(`#${TAG_IDS.rewards_incorrect}`);

                    if (correct_rewards && incorrect_rewards) {
                        const correct_cts = this._correct_rewards(reward_cts, confidence_pct);
                        const incorrect_cts = this._incorrect_rewards(reward_cts, confidence_pct);

                        const correct_pounds = (parseFloat(correct_cts) / 100).toFixed(3);
                        const incorrect_pounds = (parseFloat(incorrect_cts) / 100).toFixed(3);

                        correct_rewards.textContent = `${correct_cts} cents (£${correct_pounds})`;
                        incorrect_rewards.textContent = `${incorrect_cts} cents (£${incorrect_pounds})`;
                    }
                }

                _secure_timer() {
                    if (this.current_view.timer >= 0) {
                        let tag = this.content.querySelector(`#${TAG_IDS.timer}`);
                        tag.textContent = this.current_view.timer.toFixed(0);
                        tag.classList.remove('text-danger');

                        let tag_source_model = this.content.querySelector(`#${TAG_IDS.image}`);
                        let imgs = Array.from(tag_source_model.querySelectorAll('img'));
                        
                        Promise.all(imgs.map(async (img) => {
                            await img.decode();
                            return img;
                        })).then(() => {                        
                            this._timer();
                        }).catch((err) => {
                            console.error(err);
                            this._timer();
                        });
                    }
                }

                _submit() {
                    /** @type {HTMLFormElement} */
                    let form = this.content.querySelector(`#${TAG_IDS.labels_list}`);
                    let form_data = new FormData(form);

                    if (form_data.get('labels') == null && !this.time_exceeded_timer) {
                        let error_tag = this.content.querySelector(`#${TAG_IDS.error}`);
                        error_tag.textContent = 'Please select a label';
                        return;
                    }

                    let selected_label = form_data.get('labels') == null ? null : parseInt(/** @type {string} */ (form_data.get('labels')), 10);
                    const expected_truth = parseInt(this.current_view.truth, 10);

                    let likert_val = 1;
                    let confidence_pct = 0;

                    if (this.current_view.confidence) {
                        /** @type {HTMLFormElement} */
                        let likert_form = this.content.querySelector(`#${TAG_IDS.likert_form}`);
                        let likert_data = new FormData(likert_form);
                        likert_val = parseInt(/** @type {string} */ (likert_data.get('likert_val') || '1'), 10);
                        
                        this.last_likert_value = likert_val;
                        confidence_pct = LIKERT_MAP[likert_val] ? LIKERT_MAP[likert_val].pct : 0;
                    }

                    const REWARD_CTS = this._get_reward_cts();
                    const is_correct = (selected_label === expected_truth);
                    
                    let step_reward = 0;
                    if (is_correct) {
                        step_reward = parseFloat(this._correct_rewards(REWARD_CTS, confidence_pct)) / 100;
                        if (this.correct_step_index === -1) {
                            this.correct_step_index = this.current_view.current_image_index;
                        }
                    } else {
                        step_reward = parseFloat(this._incorrect_rewards(REWARD_CTS, confidence_pct)) / 100;
                    }

                    this.total_earned += step_reward;
                    this.total_max += REWARD_CTS;

                    store.dispatch(keys.a_update_save, {
                        instances: [{
                            answers: selected_label,
                            confidence: confidence_pct,
                            confidence_likert: likert_val,
                            time: this.current_time,
                            is_time_exceeded: this.time_exceeded_timer,
                            expected: this.current_view.truth,
                            earned_reward: step_reward
                        }]
                    });

                    this.current_view.current_image_index += 1;

                    if (this.current_view.current_image_index >= this.current_view.images.length) {
                        this._finish_task();
                    } else {
                        this._init();
                    }
                }

                _finish_task() {
                    if (this.timer_id) {
                        clearInterval(this.timer_id);
                    }

                    const earned_formatted = parseFloat(this.total_earned.toFixed(2));
                    const max_formatted = parseFloat(this.total_max.toFixed(2));

                    store.dispatch(keys.a_update_experiment_scores, {
                        first_correct_index: this.correct_step_index,
                        earned_reward: earned_formatted,
                        max_reward: max_formatted
                    });

                    nextView();
                }

                _timer() {
                    function timer_text(time) {
                        return `Time left: ${time} seconds`;
                    }
                    let tag = this.content.querySelector(`#${TAG_IDS.timer}`);
                    
                    if (this.current_view.timer >= 0) {
                        tag.textContent = timer_text(this.current_view.timer.toFixed(0));
                        tag.classList.remove('text-danger');
                    }

                    let delta_time = 100;
                    this.timer_id = window.setInterval(() => {
                        this.current_time += delta_time;
                        let current_time_second = this.current_time / 1000;

                        let remaining_time = this.current_view.timer - current_time_second;
                        
                        if (remaining_time <= 3) {
                            tag.classList.add('text-danger');
                        }
                        if (this.current_view.timer >= 0) {
                            if (current_time_second % 1 == 0) {
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
                    if (this.timer_id) {
                        clearInterval(this.timer_id);
                    }
                    this.current_time = 0;
                    this.time_exceeded_timer = false;
                    this._clear_error();
                    this._desc();
                    this._images();
                    this._labels();

                    const rewards_div = this.content.querySelector(`#${TAG_IDS.rewards}`);
                    if (rewards_div) {
                        if (this.current_view.show_rewards) {
                            rewards_div.classList.remove('d-none');
                            
                            const header_tag = this.content.querySelector(`#${TAG_IDS.rewards_header}`);
                            if (header_tag) {
                                header_tag.textContent = this._is_training()
                                    ? 'Practice Reward (Simulated) if you respond:'
                                    : 'Bonus Reward (Accumulative) if you respond:';
                            }
                        } else {
                            rewards_div.classList.add('d-none');
                        }
                    }

                    if (this.current_view.confidence) {
                        let radio_target = this.content.querySelector(`#likert-${this.last_likert_value}`);
                        if (radio_target) {
                            /** @type {HTMLInputElement} */ (radio_target).checked = true;
                        }
                        this._update_reward_displays(this.last_likert_value);
                    }

                    this._secure_timer();
                }

                _init_events() {
                    let next_btn = this.content.querySelector(`#${TAG_IDS.next_btn}`);
                    if (next_btn) {
                        next_btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            this._submit();
                        });
                    }
                    
                    if (this.current_view.confidence) {
                        const likert_form = this.content.querySelector(`#${TAG_IDS.likert_form}`);
                        if (likert_form) {
                            likert_form.addEventListener('change', (e) => {
                                const target = /** @type {HTMLInputElement} */ (e.target);
                                if (target && target.name === 'likert_val') {
                                    const selected_val = parseInt(target.value, 10);
                                    this.last_likert_value = selected_val;
                                    this._update_reward_displays(selected_val);
                                }
                            });
                        }
                    } else {
                        const conf_container = this.content.querySelector(`#${TAG_IDS.confidence}`);
                        if (conf_container) { conf_container.innerHTML = ''; }
                    }
                }
             
                connectedCallback () {
                    /* Guard */                
                    let is_legit = guardView(PAGE_NAMES.CHAIN_EXPE_DISCR);
                    if (!is_legit) { return; }

                    this.appendChild(TEMPLATE.content.cloneNode(true));
                    /** @type {HTMLElement} */
                    this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                    /** @type {ChainExperimentDiscr} */
                    this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                    this.timer_id = undefined;
                    this.current_time = 0;
                    this.time_exceeded_timer = false;

                    this.correct_step_index = -1;
                    this.total_earned = 0;
                    this.total_max = 0;
                    this.last_likert_value = 1;

                    this._init_events();
                    this._init();
                }         

                disconnectedCallback () {
                    if (this.timer_id) {
                        clearInterval(this.timer_id);
                    }
                }
            }

            customElements.define(PAGE_NAME, ChainExperimentDiscrElement);
        };

        if (!customElements.get(PAGE_NAME)) {
            defineElement();
        }
    })();
}
catch (err) {
    console.error(err);
}
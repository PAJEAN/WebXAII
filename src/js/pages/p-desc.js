// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { Desc } from 'JS/store/modules/view-classes';

try {
    const TAG_IDS = {
        body_text:     'body-text',
        btn_container: 'btn-container',
        card_body:     'card-body',
        main_page:     'main-page',
        score:         'score',
        title:         'title',
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.DESC;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    min-height: 100vh;
                    font-size: 1.2em;
                }
                .container {
                    width: 50%;
                }
                .card {
                    box-shadow: var(--box-shadow);
                }
                @media (max-width: 768px) {
                    .container {
                        width: 75%;
                    }
                }
            </style>

            <div id="${TAG_IDS.main_page}" class="d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card m-auto">
                        <div id="${TAG_IDS.card_body}" class="card-body">
                            <div id="${TAG_IDS.title}" class="card-title text-uppercase text-center"></div>
                            <div id="${TAG_IDS.body_text}" class="text-center mt-3"></div>
                            <div id="${TAG_IDS.score}" class="text-center fw-bold mt-2"></div>
                            <div class="mt-2" id="${TAG_IDS.btn_container}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const defineElement = () => {
            class DescElement extends HTMLElement {
                constructor() {
                    super();
                }

                _countdown() {
                    let card_body = this.content.querySelector(`#${TAG_IDS.card_body}`);
                    let tag = document.createElement('div');
                    tag.textContent = `Automatically starting in ${this.current_time}...`;
                    tag.classList.add('text-center', 'text-secondary', 'fst-italic', 'mt-2');
                    this.timer_id = window.setInterval(() => {
                        this.current_time -= 1;
                        tag.textContent = `Automatically starting in ${this.current_time}...`;
                        if (this.current_time <= 0) {
                            nextView();
                        }
                    }, 1000);
                    card_body.appendChild(tag);
                }

                _score_exp() {
                    let experiment_scores = store.state[keys.s_experiment_scores];
                    if (experiment_scores.length > 0) {
                        let score_tag = this.content.querySelector(`#${TAG_IDS.score}`);
                        let score = experiment_scores.reduce((acc, value) => {
                            const val = typeof value === 'object' && value !== null ? value.first_correct_index : value;
                            return acc + val;
                        }, 0) / experiment_scores.length;
                        score_tag.textContent = `${(score * 100).toFixed(2)}%`;
                        store.dispatch(keys.a_reset_experiment_scores, {});
                    }
                }

                _score() {
                    let experiment_scores = store.state[keys.s_experiment_scores];
                    if (experiment_scores && experiment_scores.length > 0) {
                        let score_tag = this.content.querySelector(`#${TAG_IDS.score}`);
                        let score_content = [];

                        let is_chain_experiment = experiment_scores.some(s => 
                            (typeof s === 'object' && s !== null) || s === -1 || s > 1
                        ) || (this.current_view && this.current_view.type === 'chain');

                        if (is_chain_experiment) {
                            let grand_total_earned = 0;
                            let grand_total_max = 0;
                            let has_rewards = false;

                            // Iterate over all completed sample scores
                            for (let i = 0; i < experiment_scores.length; i++) {
                                let raw_score = experiment_scores[i];
                                let sampleNum = i + 1;

                                let step_index = typeof raw_score === 'object' && raw_score !== null 
                                    ? raw_score.first_correct_index 
                                    : raw_score;

                                let message = (step_index === -1 || step_index === undefined || step_index === null) 
                                    ? `Sample ${sampleNum}: You did not manage to recognize this sample` 
                                    : `Sample ${sampleNum}: You recognized this sample at step ${step_index + 1}`;

                                if (typeof raw_score === 'object' && raw_score !== null && raw_score.earned_reward !== undefined) {
                                    grand_total_earned += raw_score.earned_reward;
                                    grand_total_max += raw_score.max_reward;
                                    has_rewards = true;
                                }

                                score_content.push(message);
                            }

                            // Append total remuneration sum ONLY if show_rewards is true on the view config
                            if (has_rewards && this.current_view.show_rewards) {
                                score_content.push(
                                    `<div class="mt-3 fs-4 text-success fw-bold">` +
                                    `Total Remuneration: £${grand_total_earned.toFixed(2)} / £${grand_total_max.toFixed(2)}` +
                                    `</div>`
                                );
                            }

                            score_tag.innerHTML = score_content.join('<br>');
                        } else {
                            // Single-Image Accuracy Layout
                            let correct_count = experiment_scores.reduce((acc, val) => acc + (val === 1 ? 1 : 0), 0);
                            let accuracy = (correct_count / experiment_scores.length) * 100;

                            score_tag.innerHTML = `Accuracy: ${accuracy.toFixed(1)}% (${correct_count}/${experiment_scores.length} Correctly Recognized)`;
                        }

                        // Reset store scores for subsequent blocks
                        store.dispatch(keys.a_reset_experiment_scores, {});
                    }
                }

                _submit() {
                    nextView();
                }

                _init() {
                    let tag_title = this.content.querySelector(`#${TAG_IDS.title}`);
                    tag_title.innerHTML = this.current_view.title;
                    let tag_text = this.content.querySelector(`#${TAG_IDS.body_text}`);
                    tag_text.innerHTML = this.current_view.body_text;
                    if (this.current_view.with_button) {
                        let btn_container = this.content.querySelector(`#${TAG_IDS.btn_container}`);
                        let btn = document.createElement('button');
                        btn.textContent = this.current_view.button_text;
                        btn.classList.add('btn', 'btn-primary', 'btn-lg', 'text-uppercase', 'mt-3', 'w-100');
                        btn.addEventListener('click', this._submit, { once: true });
                        btn_container.appendChild(btn);
                    }
                    if (this.current_view.countdown) {
                        this.current_time = this.current_view.countdown;
                        this._countdown();
                    }
                    if (this.current_view.score) {
                        this._score();
                    }
                }
             
                connectedCallback () {
                     /* Guard */
                     let is_legit = guardView(PAGE_NAMES.DESC);
                     if (!is_legit) { return; }
                    /* Html */
                    this.appendChild(TEMPLATE.content.cloneNode(true));
                    /* Attributes */
                    this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                    this.current_time = 0;
                    /** @type {number | undefined} */
                    this.timer_id = undefined;
                    /** @type {Desc} */
                    this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];                
                    this._submit = this._submit.bind(this);
                    /* Methods */
                    this._init();
                }
              
                disconnectedCallback () {
                    if (this.timer_id) {
                        clearInterval(this.timer_id);
                    }
                }
            }

            customElements.define(PAGE_NAME, DescElement);
        };

        if (!customElements.get(PAGE_NAME)) {
            defineElement();
        }
    })();
}
catch (err) {
    console.error(err);
}
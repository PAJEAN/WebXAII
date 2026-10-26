// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    const TAG_IDS = {
        main_page: 'main-page',
        card_body: 'card-body',
        title: 'title',
        body_text: 'body-text',
        score: 'score',
        btn_container: 'btn-container'
    };

    const LIKERT_DESCRIPTORS = {
        1: 'Very Low (0%)',
        2: 'Low (25%)',
        3: 'Moderate (50%)',
        4: 'High (75%)',
        5: 'Very High (100%)'
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.DESC_DISCR || 'p-desc-discr';

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
                            <div id="${TAG_IDS.title}" class="card-title text-uppercase text-center h3 mb-3">
                                Task Summary
                            </div>
                            <div id="${TAG_IDS.body_text}" class="text-center mt-3"></div>
                            <div id="${TAG_IDS.score}" class="text-center fw-bold mt-3"></div>
                            <div class="mt-4" id="${TAG_IDS.btn_container}">
                                <button id="summary-next-btn" class="btn btn-primary btn-lg text-uppercase w-100">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const defineElement = () => {
            class DescDiscrElement extends HTMLElement {
                constructor() {
                    super();
                }

                _render_scores() {
                    let experiment_scores = store.state[keys.s_experiment_scores] || [];
                    let saved_instances = store.state[keys.s_saved_instances] || [];
                    let score_tag = this.content.querySelector(`#${TAG_IDS.score}`);

                    if (!score_tag || experiment_scores.length === 0) {
                        if (score_tag) score_tag.textContent = 'No task data recorded.';
                        return;
                    }

                    let score_content = [];
                    let grand_total_earned = 0;
                    let grand_total_max = 0;
                    let has_rewards = false;

                    for (let i = 0; i < experiment_scores.length; i++) {
                        let raw_score = experiment_scores[i];
                        let sampleNum = i + 1;

                        let step_index = (typeof raw_score === 'object' && raw_score !== null)
                            ? raw_score.first_correct_index 
                            : raw_score;

                        let step_msg = (step_index === -1 || step_index === undefined || step_index === null) 
                            ? `Sample ${sampleNum}: Not recognized` 
                            : `Sample ${sampleNum}: Recognized at Clarity Level ${step_index + 1}`;

                        // Extract discretized Likert descriptor from step instance
                        let inst = saved_instances[i];
                        let confidence_msg = '';
                        if (inst && typeof inst.confidence_likert === 'number') {
                            const label = LIKERT_DESCRIPTORS[inst.confidence_likert] || 'N/A';
                            confidence_msg = ` — Confidence: ${label}`;
                        } else if (inst && typeof inst.confidence === 'number') {
                            confidence_msg = ` — Confidence: ${inst.confidence}%`;
                        }

                        score_content.push(`<div>${step_msg}${confidence_msg}</div>`);

                        if (typeof raw_score === 'object' && raw_score !== null && raw_score.earned_reward !== undefined) {
                            grand_total_earned += raw_score.earned_reward;
                            grand_total_max += raw_score.max_reward;
                            has_rewards = true;
                        }
                    }

                    // Append total remuneration calculation
                    if (has_rewards && this.current_view && this.current_view.show_rewards) {
                        const is_potential = Boolean(this.current_view.show_as_potential);
                        const label = is_potential ? "Potential Remuneration" : "Remuneration";
                        const textColorClass = is_potential ? "text-danger" : "text-success";

                        score_content.push(
                            `<div class="mt-4 fs-4 ${textColorClass} fw-bold">` +
                            `${label}: £${grand_total_earned.toFixed(2)} / £${grand_total_max.toFixed(2)}` +
                            `</div>`
                        );
                    }

                    score_tag.innerHTML = score_content.join('');

                    // Reset experiment scores in store after presentation
                    store.dispatch(keys.a_reset_experiment_scores, {});
                }

                _init() {
                    let tag_title = this.content.querySelector(`#${TAG_IDS.title}`);
                    if (this.current_view && this.current_view.title) {
                        tag_title.innerHTML = this.current_view.title;
                    }

                    let tag_text = this.content.querySelector(`#${TAG_IDS.body_text}`);
                    if (this.current_view && this.current_view.body_text) {
                        tag_text.innerHTML = this.current_view.body_text;
                    }

                    let next_btn = this.content.querySelector('#summary-next-btn');
                    if (next_btn) {
                        if (this.current_view && this.current_view.button_text) {
                            next_btn.textContent = this.current_view.button_text;
                        }
                        next_btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            nextView();
                        }, { once: true });
                    }

                    this._render_scores();
                }
             
                connectedCallback() {
                    let is_legit = guardView(PAGE_NAME);
                    if (!is_legit) { return; }

                    this.appendChild(TEMPLATE.content.cloneNode(true));
                    /** @type {HTMLElement} */
                    this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                    this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                    
                    this._init();
                }
            }

            customElements.define(PAGE_NAME, DescDiscrElement);
        };

        if (!customElements.get(PAGE_NAME)) {
            defineElement();
        }
    })();
}
catch (err) {
    console.error(err);
}
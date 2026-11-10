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

    (function() {
        const PAGE_NAME = PAGE_NAMES.TOTAL_REWARD || 'p-total-reward';

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
                                Total Summary
                            </div>
                            <div id="${TAG_IDS.body_text}" class="text-center mt-3"></div>
                            <div id="${TAG_IDS.score}" class="text-center fw-bold mt-3"></div>
                            <div class="mt-4" id="${TAG_IDS.btn_container}">
                                <button id="total-reward-next-btn" class="btn btn-primary btn-lg text-uppercase w-100">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const defineElement = () => {
            class TotalRewardDiscrElement extends HTMLElement {
                constructor() {
                    super();
                }

                _render_total_rewards() {
                    let permanent_scores = store.state[keys.s_permanent_eval_scores] || [];
                    let score_tag = this.content.querySelector(`#${TAG_IDS.score}`);

                    if (!score_tag) return;

                    let total_earned_bonus = 0;
                    let total_max_bonus = 0;

                    permanent_scores.forEach(scoreObj => {
                        if (scoreObj && typeof scoreObj.earned_reward === 'number') {
                            total_earned_bonus += scoreObj.earned_reward;
                            total_max_bonus += scoreObj.max_reward;
                        }
                    });

                    const baseBudget = (this.current_view && typeof this.current_view.base_budget === 'number') 
                        ? this.current_view.base_budget 
                        : 1.00;

                    const finalEarnedTotal = baseBudget + total_earned_bonus;
                    const finalMaxPossible = baseBudget + total_max_bonus;

                    score_tag.innerHTML = `
                        <div class="mb-2 text-secondary">Initial Participation Budget: £${baseBudget.toFixed(2)}</div>
                        <div class="mb-2 text-secondary">Performance Bonus Earned: £${total_earned_bonus.toFixed(2)} / £${total_max_bonus.toFixed(2)}</div>
                        <div class="mt-4 fs-4 text-success fw-bold">
                            Total Payout: £${finalEarnedTotal.toFixed(2)} / £${finalMaxPossible.toFixed(2)}
                        </div>
                    `;
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

                    let next_btn = this.content.querySelector('#total-reward-next-btn');
                    if (next_btn) {
                        if (this.current_view && this.current_view.button_text) {
                            next_btn.textContent = this.current_view.button_text;
                        }
                        next_btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            nextView();
                        }, { once: true });
                    }

                    this._render_total_rewards();
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

            customElements.define(PAGE_NAME, TotalRewardDiscrElement);
        };

        if (!customElements.get(PAGE_NAME)) {
            defineElement();
        }
    })();
}
catch (err) {
    console.error(err);
}
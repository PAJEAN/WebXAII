// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { Desc } from 'JS/store/modules/view-classes';
/* Utils */
import { DATA_URL } from 'JS/utils/constants';

try {
    const TAG_IDS = {
        body_text:     'body-text',
        btn_container: 'btn-container',
        card_body:     'card-body',
        main_page:     'main-page',
        title:         'title',
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.DESC;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    height: 100vh;
                }
                .title {
                    text-align: center;
                    font-size: 28px;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
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
                            <h3 id="${TAG_IDS.title}" class="card-title text-uppercase text-center"></h3>
                            <div id="${TAG_IDS.body_text}" class="text-center mt-3"></div>
                            <div class="mt-3" id="${TAG_IDS.btn_container}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
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

            _submit() {
                nextView();
            }

            _init() {
                let tag_title = this.content.querySelector(`#${TAG_IDS.title}`);
                tag_title.textContent = this.current_view.title;
                let tag_text = this.content.querySelector(`#${TAG_IDS.body_text}`);
                tag_text.textContent = this.current_view.body_text;
                if (this.current_view.with_button) {
                    let btn_container = this.content.querySelector(`#${TAG_IDS.btn_container}`);
                    let btn = document.createElement('button');
                    btn.textContent = this.current_view.button_text;
                    btn.classList.add('btn', 'btn-primary', 'btn-lg', 'text-uppercase', 'mt-3', 'w-100');
                    btn.addEventListener('click', this._submit);
                    btn_container.appendChild(btn);
                }
                if (this.current_view.countdown) {
                    this.current_time = this.current_view.countdown;
                    this._countdown();
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
        });
    })();
}
catch (err) {
    console.error(err);
}


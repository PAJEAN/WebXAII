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

            <div id="main-page" class="d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card m-auto">
                        <div class="card-body">
                            <h3 id="title" class="card-title text-uppercase text-center"></h3>
                            <div id="body-text" class="text-center mt-3"></div>
                            <div class="mt-3" id="btn-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _submit() {
                nextView();
            }

            _init() {
                let tag_title = this.content.querySelector('#title');
                tag_title.textContent = this.current_view.title;
                let tag_text = this.content.querySelector('#body-text');
                tag_text.textContent = this.current_view.body_text;
                if (this.current_view.with_button) {
                    let btn_container = this.content.querySelector('#btn-container');
                    let btn = document.createElement('button');
                    btn.textContent = this.current_view.button_text;
                    btn.classList.add('btn', 'btn-primary', 'btn-lg', 'text-uppercase', 'mt-3', 'w-100');
                    btn.addEventListener('click', this._submit);
                    btn_container.appendChild(btn);
                }
            }
         
            connectedCallback () {
                 /* Guard */
                 let is_legit = guardView(PAGE_NAMES.DESC);
                 if (!is_legit) { return; }
                /* Html */
                this.appendChild(TEMPLATE.content.cloneNode(true));
                /* Attributes */
                this.content = this.querySelector('#main-page');
                /** @type {Desc} */
                this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];                
                this._submit = this._submit.bind(this);
                /* Methods */
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


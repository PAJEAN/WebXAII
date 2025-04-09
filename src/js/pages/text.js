// @ts-check

/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.TEXT;

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
                            <h3 id="title" class="card-title text-uppercase text-center">Title</h3>
                            <div id="text" class="text-center mt-3">Text</div>
                            <div class="mt-3">
                                <button id="next-btn" type="button" class="btn btn-primary btn-lg text-uppercase mt-3 w-100">Button</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _init() {
                let tag_title = this.content.querySelector('#title');
                let view = store.state[keys.g_current_view];
                if (view.hasOwnProperty('title')) {
                    tag_title.textContent = view['title'];
                }
                let tag_text = this.content.querySelector('#text');
                if (view.hasOwnProperty('text')) {
                    tag_text.textContent = view['text'];
                }
                let btn = this.content.querySelector('#next-btn');
                if (view.hasOwnProperty('btn')) {
                    btn.textContent = view['btn'];
                }
                btn.addEventListener('click', nextView);
            }
         
            connectedCallback () {
                guardView(PAGE_NAMES.TEXT);

                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


// @ts-check

/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
import { FormComponent } from 'JS/components/wc-form';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.FORM;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                #main-page {
                    min-height: 100vh;
                }
                .card {
                    border: none;
                }
            </style>

            <div id="main-page" class="d-flex flex-column justify-content-center">
                <div class="container w-75">
                    <div class="card m-auto">
                        <div class="card-body">
                            <${COMPONENT_NAMES.FORM} id="form"></${COMPONENT_NAMES.FORM}>
                            <div class="mt-4">
                                <button id="next-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100">Submit</button>
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

            _transition(response) {
                store.dispatch(keys.a_update_save, {answers: response});
                nextView();
            }

            _submit() {
                /** @type {FormComponent} */
                let form = this.content.querySelector('#form');
                if (!form.someEmptyQuestion()) {
                    let responses = form.submit();
                    this._transition(responses);
                }
                
            }

            _init() {
                let btn = this.content.querySelector('#next-btn');
                btn.addEventListener('click', this._submit);
            }
         
            connectedCallback () {
                let is_legit = guardView(PAGE_NAMES.FORM);
                if (!is_legit) { return; }
                
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');

                this._submit = this._submit.bind(this); // Bind to remove listener (otherwise bind create a new function).

                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


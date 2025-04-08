/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Lib */
import { nextPage } from '../lib/next_page.js';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/task';

try {
    (function() {
        const PAGE_NAME = COMPONENT_NAMES.FORM;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                legend {
                    margin: 0;
                }
                #main {
                    /* Display & Box Model */
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                }
            </style>

            <div id="main">
                <div class="container p-2">
                    <div id="questions" class="questions"></div>
                    <button id="submit-btn" type="button" class="btn btn-primary btn-lg text-uppercase mt-2 w-100">Submit</button>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            checkbox(id, value, content) {
                let div = document.createElement('div');
                div.classList.add('form-check');
                let input = document.createElement('input');
                input.classList.add('form-check-input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('id', id);
                input.setAttribute('value', value);
                let label = document.createElement('label');
                label.classList.add('form-check-label');
                label.setAttribute('for', id);
                label.textContent = content;
                div.appendChild(input);
                div.appendChild(label)
                return div;
            }

            radio(id, name, content) {
                let div = document.createElement('div');
                div.classList.add('form-check');
                let input = document.createElement('input');
                input.classList.add('form-check-input');
                input.setAttribute('type', 'radio');
                input.setAttribute('id', id);
                input.setAttribute('name', name);
                let label = document.createElement('label');
                label.classList.add('form-check-label');
                label.setAttribute('for', id);
                label.textContent = content;
                div.appendChild(input);
                div.appendChild(label)
                return div;
            }

            submit() {
                               
                let fieldsets = this.content.querySelectorAll('fieldset');
                for (let fieldset of fieldsets) {
                    let inputs = fieldset.querySelectorAll('input');
                    for (let input of inputs) {
                        console.log(input.checked);
                    }                 
                }
                nextPage();
            }

            init() {
                let current_index_view = store.state[keys.s_current_index_task];
                let current_view = store.state[keys.s_task][current_index_view];
                let view_type = current_view['type'];
                
                if (!view_type) {
                    return;
                }

                let questions_div = this.content.querySelector('#questions');
                let i = 0;
                for (let question of current_view['questions'] ) {
                    let fieldset = document.createElement('fieldset');
                    if (i > 0) {
                        fieldset.classList.add('mt-2');
                    }

                    let legend = document.createElement('legend');
                    legend.textContent = question['title'];
                    let sub_title = document.createElement('div');
                    sub_title.classList.add('text-secondary');
                    sub_title.textContent = question['sub_title'];
                    fieldset.appendChild(legend);
                    fieldset.appendChild(sub_title);

                    let j = 0;
                    for (let answer of question['answers']) {
                        let div;
                        switch (question['type']) {
                            case 'radio':
                                div = this.radio(`#${i}_${j}`, `name-${i}`, answer);
                                break;
                            default:
                                div = this.checkbox(`#${i}_${j}`, j, answer);
                        }
                        fieldset.appendChild(div);
                        j++;
                    }

                    i++;
                    questions_div.appendChild(fieldset);
                }

                let submit_btn = this.content.querySelector('#submit-btn');
                submit_btn.addEventListener('click', this.submit.bind(this));
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main');
                this.init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


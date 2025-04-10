// @ts-check

/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';


const COMPONENT_NAME = COMPONENT_NAMES.FORM;

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
        </div>
    </div>

`;

export class MyForm extends HTMLElement {
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
        let responses = [];
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let fieldset = fieldsets[i];
            let inputs = fieldset.querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                let input = inputs[j];
                responses.push(input.checked);
                console.log(input.checked);
            }
        }
        return responses;
    }
    
    init() {
        let questions_div = this.content.querySelector('#questions');
        let current_view = store.state[keys.g_current_view];
        let view_type = current_view['type'];
        
        if (!view_type) {
            return;
        }

        let questions = [];
        if (view_type == PAGE_NAMES.TASK) {
            questions = [current_view['choice']];
        } else {
            questions = current_view['questions']
        }

        let i = 0;
        for (let question of questions) {
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
    }
    
    connectedCallback () {
        this.appendChild(TEMPLATE.content.cloneNode(true));
        this.content = this.querySelector('#main');
        this.init();
    }
    
    disconnectedCallback () {}
}

try {
    (function() {
        window.customElements.define(COMPONENT_NAME, MyForm);
    })();
}
catch (err) {
    console.error(err);
}


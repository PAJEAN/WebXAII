// @ts-check

/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { Experiment, Form, Question, View } from 'JS/store/modules/view-classes';


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

export class FormComponent extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * @param {string} type 
     * @param {string} id 
     * @param {string} value_or_name 
     * @param {string} content 
     * @returns 
     */
    inputType(type, id, value_or_name, content) {
        let div = document.createElement('div');
        div.classList.add('form-check');
        let input = document.createElement('input');
        input.classList.add('form-check-input');
        input.setAttribute('type', type);
        input.setAttribute('id', id);
        if (type == 'checkbox') {
            input.setAttribute('value', value_or_name);
        } else if (type == 'radio'){
            input.setAttribute('name', value_or_name);
        }
        let label = document.createElement('label');
        label.classList.add('form-check-label');
        label.setAttribute('for', id);
        label.textContent = content;
        div.appendChild(input);
        div.appendChild(label)
        return div;
    }

    /**
     * Return all input checked status.
     * @returns {Array<boolean>}
     */
    submit() {
        let responses = [];
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let fieldset = fieldsets[i];
            let inputs = fieldset.querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                let input = inputs[j];
                responses.push(input.checked);
            }
        }
        
        console.log(`wc-form responses: ${responses}`);
        
        return responses;
    }

    /**
     * Unchecked all inputs.
     */
    unchecked() {
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let fieldset = fieldsets[i];
            let inputs = fieldset.querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                let input = inputs[j];
                input.checked = false;
            }
        }
    }
    
    init() {
        let questions_div = this.content.querySelector('#questions');

        let i = 0;
        for (let question of this.questions) {
            let fieldset = document.createElement('fieldset');
            if (i > 0) {
                fieldset.classList.add('mt-2');
            }

            let legend = document.createElement('legend');
            legend.textContent = question.primary_text;
            let sub_title = document.createElement('div');
            sub_title.classList.add('text-secondary');
            sub_title.textContent = question.secondary_text;
            fieldset.appendChild(legend);
            fieldset.appendChild(sub_title);

            let j = 0;
            for (let answer of question.answers) {
                let div;
                switch (question.type) {
                    case 'radio':
                        div = this.inputType('radio', `#${i}_${j}`, `name-${i}`, answer);
                        break;
                    case 'textfield':
                        div = this.inputType('text', `#${i}_${j}`, `name-${i}`, answer);
                        break;
                    default:
                        div = this.inputType('checkbox', `#${i}_${j}`, 'j', answer);
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
        /* Attributes */
        this.content = this.querySelector('#main');
        /** @type {Array<Question>} */
        this.questions = [];
        /** @type {View} */
        let current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];

        console.log('-- wc-form --');
        
        if (current_view instanceof Experiment) {
            this.questions.push(current_view.question);
        } else if (current_view instanceof Form) {
            this.questions.push(...current_view.questions);
        }           
        /* Methods */
        this.init();
    }
    
    disconnectedCallback () {}
}

try {
    (function() {
        window.customElements.define(COMPONENT_NAME, FormComponent);
    })();
}
catch (err) {
    console.error(err);
}


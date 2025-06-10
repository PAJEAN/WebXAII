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

    _getInputs() {
        let inputs = [];
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let fieldset = fieldsets[i];
            let current_inputs = fieldset.querySelectorAll('input');
            inputs = [...inputs, ...current_inputs];
        }
        return inputs;
    }

    enable() {
        let inputs = this._getInputs();
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].removeAttribute('disabled');
        }
    }

    disable() {
        let inputs = this._getInputs();
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].setAttribute('disabled', '');
        }
    }

    /**
     * @param {string} type 
     * @param {string} id 
     * @param {string} value_or_name 
     * @param {string} content 
     * @returns {HTMLDivElement}
     */
    inputType(type, id, value_or_name, content) {
        let div = document.createElement('div');
        div.classList.add('form-check');
        let input = document.createElement('input');

        input.setAttribute('type', type);
        input.setAttribute('id', id);

        let label = document.createElement('label');
        label.setAttribute('for', id);

        switch(type) {
            case 'checkbox':
                input.setAttribute('value', value_or_name);
                input.classList.add('form-check-input');
                label.classList.add('form-check-label');
                label.textContent = content;
                div.appendChild(label);
                break;
            case 'radio':
                input.setAttribute('name', value_or_name);
                input.classList.add('form-check-input');
                label.classList.add('form-check-label');
                label.textContent = content;
                div.appendChild(label);
                break;
            case 'range':
                input.setAttribute('min', '0');
                input.setAttribute('max', '100');
                input.classList.add('form-range');
                label.classList.add('form-label');
                break;
            case 'text':
                input.setAttribute('size', '110');
                input.classList.add('form-control');
                label.classList.add('form-label');
                break;
        }

        
        div.appendChild(input);
        return div;
    }

    /**
     * Check if a question is not answered.
     * @returns {boolean}
     */
    someEmptyQuestion() {
        let responses = this.responses();
        for (let response of responses) {
            if (response.length == 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return all input checked status.
     * @returns {Array<Array<number|string>>}
     */
    responses() {
        let responses = [];
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let current_responses = [];
            let fieldset = fieldsets[i];
            let inputs = fieldset.querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                let input = inputs[j];

                switch(input.type) {
                    case 'checkbox':
                    case 'radio':
                        if (input.checked) {
                            current_responses.push(j);
                        }
                        break;
                    case 'range':
                    case 'text':
                        current_responses.push(input.value);
                        break;
                }
            }
            responses.push(current_responses);
        }
        return responses;
    }

    /**
     * Return all input checked status.
     * @returns {Array<Array<number|string>>}
     */
    submit() {
        let responses = this.responses();        
        console.log(`---- wc-form responses:`);
        console.log(responses);
        
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
                switch(input.type) {
                    case 'checkbox':
                    case 'radio':
                        input.checked = false;
                        break;
                    case 'range':
                        input.value = '50';
                    case 'text':
                        input.value = '';
                        break;
                }
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
            if (question.type == 'radio' || question.type == 'checkbox') {
                for (let answer of question.answers) {
                    let div = document.createElement('div');
                    switch (question.type) {
                        case 'radio':
                            div = this.inputType('radio', `#${i}_${j}`, `name-${i}`, answer);
                            break;
                        case 'checkbox':                            
                            div = this.inputType('checkbox', `#${i}_${j}`, 'j', answer);
                            break;
                    }
                    fieldset.appendChild(div);
                    j++;
                }
            } else {
                let div = document.createElement('div');
                if (question.type == 'textfield') {                    
                    div = this.inputType('text', `#${i}_${j}`, `name-${i}`, null);
                } else {
                    div = this.inputType('range', `#${i}_${j}`, `name-${i}`, null);
                }
                fieldset.appendChild(div);
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


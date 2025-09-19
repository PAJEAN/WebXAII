// @ts-check

/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { EnumQuestionOptions, Experiment, Form, Question, View } from 'JS/store/modules/view-classes';


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
        input[type='checkbox'],
        input[type='radio'] {
            margin: 5px;
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

    _getInputsButtons() {
        let inputs = [];
        let fieldsets = this.content.querySelectorAll('fieldset');
        for (let i = 0; i < fieldsets.length; i++) {
            let fieldset = fieldsets[i];
            let current_inputs = fieldset.querySelectorAll('input');
            let current_buttons = fieldset.querySelectorAll('button');
            inputs = [...inputs, ...current_inputs, ...current_buttons];
        }
        return inputs;
    }

    enable() {
        let inputs = this._getInputsButtons();
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].removeAttribute('disabled');
        }
    }

    disable() {
        let inputs = this._getInputsButtons();
        for (let j = 0; j < inputs.length; j++) {
            inputs[j].setAttribute('disabled', '');
        }
    }

    /**
     * @param {string} id 
     * @param {Array<string>} answers 
     * @param {Object<string, any>} options
     * @returns {HTMLDivElement}
     */
    inputButton(id, answers, options = {}) {
        let div = document.createElement('div');
        div.classList.add('d-flex', 'mt-2');
        div.style.columnGap = '1rem';

        for (let i = 0; i < answers.length; i++) {
            let button = document.createElement('button');
            button.id = id;
            button.classList.add('btn', 'btn-lg', 'w-100');
            if (EnumQuestionOptions.COLORS in options) {
                if (options[EnumQuestionOptions.COLORS].length >= i + 1) {
                    button.classList.add(options[EnumQuestionOptions.COLORS][i]);
                }
            } else {
                button.classList.add('btn-info');
            }
            button.textContent = answers[i];

            button.addEventListener('click', () => {
                this.setAttribute(this.response_attribute_name, `${i}`);
            });
    
            div.appendChild(button);
        }

        return div;
    }

    /**
     * @param {string} type 
     * @param {string} id 
     * @param {string} value_or_name 
     * @param {string} content 
     * @param {Object<string, any>} options
     * @param {boolean} is_last_answer
     * @returns {HTMLDivElement}
     */
    inputType(type, id, value_or_name, content, options = {}, is_last_answer = false) {
        let div = document.createElement('div');
        
        if (EnumQuestionOptions.INLINE in options) {
            div.classList.add('form-check-inline');
        } else {
            div.classList.add('form-check');
        }
        let input = document.createElement('input');

        input.setAttribute('type', type);
        input.setAttribute('id', id);
        
        if (type == 'radio' || type == 'checkbox') {
            let label = document.createElement('label');
            label.setAttribute('for', id);
            switch(type) {
                case 'checkbox':
                    input.setAttribute('value', value_or_name);
                    input.classList.add('form-check-input');
                    label.classList.add('form-check-label');
                    label.textContent = content;
                    break;
                case 'radio':
                    input.setAttribute('name', value_or_name);
                    input.classList.add('form-check-input');
                    label.classList.add('form-check-label');
                    label.textContent = content;
                    break;
            }
            if (is_last_answer && EnumQuestionOptions.LIMIT_VALUES in options) {
                div.appendChild(input);
                div.appendChild(label);
            } else {
                div.appendChild(label);
                div.appendChild(input);
            }
        } else if (type == 'range') {
            input.setAttribute('min', EnumQuestionOptions.MIN in options ? EnumQuestionOptions.MIN: '0');
            input.setAttribute('max', EnumQuestionOptions.MAX in options ? EnumQuestionOptions.MAX: '100');
            if (EnumQuestionOptions.STEP in options) {
                input.setAttribute('step', options[EnumQuestionOptions.STEP].toString());
            }
            input.classList.add('form-range');
            if (EnumQuestionOptions.LIMIT_VALUES in options) {
                input.classList.add('mx-3');
                div.classList.remove('form-check');
                let container_div = document.createElement('div');
                container_div.classList.add('d-flex', 'align-items-center', 'justify-content-center');
                let left_div = document.createElement('div');
                left_div.classList.add('text-nowrap');
                let right_div = document.createElement('div');
                right_div.classList.add('text-nowrap');
                if (options[EnumQuestionOptions.LIMIT_VALUES] instanceof Array) {
                    left_div.textContent = options[EnumQuestionOptions.LIMIT_VALUES].length > 0 ? options[EnumQuestionOptions.LIMIT_VALUES][0]: '';
                    right_div.textContent = options[EnumQuestionOptions.LIMIT_VALUES].length > 1 ? options[EnumQuestionOptions.LIMIT_VALUES][1]: '';
                }
                container_div.appendChild(left_div);
                container_div.appendChild(input);
                container_div.appendChild(right_div);
                div.appendChild(container_div);
            } else {
                div.appendChild(input);
            }
            if (EnumQuestionOptions.DISPLAY_VALUE in options) {
                let range_output = document.createElement('output');
                range_output.setAttribute('for', id);
                range_output.classList.add('w-100', 'text-center');
                range_output.textContent = input.value;
                input.addEventListener('input', () => {
                    range_output.textContent = input.value;
                });
                div.appendChild(range_output);
            }
        } else if (type == 'text') {
            input.setAttribute('size', '110');
            input.classList.add('form-control');
            div.appendChild(input);
        }
        
        
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
            let buttons = fieldset.querySelectorAll('button');
            if (buttons.length > 0) {
                if (this.hasAttribute(this.response_attribute_name)) {
                    current_responses.push(parseInt(this.getAttribute(this.response_attribute_name)));
                }
            } else {
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
        this.removeAttribute(this.response_attribute_name);
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
            legend.innerHTML = question.primary_text;
            let sub_title = document.createElement('div');
            sub_title.classList.add('mb-2');
            sub_title.innerHTML = question.secondary_text;
            fieldset.appendChild(legend);
            fieldset.appendChild(sub_title);
            
            let j = 0;
            if (question.type == 'radio' || question.type == 'checkbox') {
                for (let answer of question.answers) {
                    let div = document.createElement('div');
                    switch (question.type) {
                        case 'radio':
                            div = this.inputType('radio', `#${i}_${j}`, `name-${i}`, answer, question.options, (j + 1) == question.answers.length);
                            break;
                        case 'checkbox':                            
                            div = this.inputType('checkbox', `#${i}_${j}`, 'j', answer, question.options, (j + 1) == question.answers.length);
                            break;
                    }
                    fieldset.appendChild(div);
                    j++;
                }
            } else if (question.type == 'button') {
                let div = this.inputButton(`#${i}_${j}`, question.answers, question.options);
                fieldset.appendChild(div);
            } else {
                let div = document.createElement('div');
                if (question.type == 'textfield') {                    
                    div = this.inputType('text', `#${i}_${j}`, `name-${i}`, null);
                } else {
                    div = this.inputType('range', `#${i}_${j}`, `name-${i}`, null, question.options);
                }
                fieldset.appendChild(div);
            }

            i++;
            questions_div.appendChild(fieldset);

            if (i < this.questions.length) {
                let hr = document.createElement('hr');
                hr.classList.add('opacity-25');
                questions_div.appendChild(hr);
            }
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
        this.response_attribute_name = 'data-response';
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


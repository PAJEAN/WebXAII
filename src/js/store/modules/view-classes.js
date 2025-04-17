// @ts-check

class LabelOrImage {

    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!view.hasOwnProperty('label')) {
            console.warn('LabelOrImage has no label');
            return false;
        }
        return true
    }

    /**
     * @param {string} label 
     * @param {boolean} is_image 
     */
    constructor(label, is_image = false, title = '') {
        this._label = label;
        this._is_image = is_image;
        this._title = title;
    }

    get label() { return this._label; }
    get is_image() { return this._is_image; }
    get title() { return this._title; }
}

export class Question {
    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!view.hasOwnProperty('type')) {
            console.warn('Question has no type');
            return false;
        }
        if (!view.hasOwnProperty('answers')) {
            console.warn('Question has no answer');
            return false;
        }
        return true;
    }

    /**
     * 
     * @param {object} view 
     */
    constructor(view) {
        this._type = view['type'];
        this._answers = view['answers'];
        this._primary_text = view['primary_text'] ? view['primary_text']: '';
        this._secondary_text = view['secondary_text'] ? view['secondary_text']: '';
    }

    get type() { return this._type; }
    get primary_text() { return this._primary_text; }
    get secondary_text() { return this._secondary_text; }
    get answers() { return this._answers; }
}

class Task {

    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!view.hasOwnProperty('expected')) {
            console.warn('Task has no expected value');
            return false;
        }
        if (view.hasOwnProperty('source')) {
            if (!LabelOrImage.guard(view['source'])) { return false; }
        }
        if (view.hasOwnProperty('model')) {
            if (!LabelOrImage.guard(view['model'])) { return false; }
        }
        if (view.hasOwnProperty('explanations')) {
            for (let explanation of view['explanations']) {
                if (!LabelOrImage.guard(explanation)) { return false; }
            }
        }
        return true
    }

    /**
     * 
     * @param {number} expected // 0, 1, 2, etc... according to number of choices.
     * @param {LabelOrImage | undefined} source 
     * @param {LabelOrImage | undefined} model 
     * @param {Array<LabelOrImage>} explanations 
     */
    constructor(expected, source = undefined, model = undefined, explanations = []) {
        this._expected = expected;
        this._source = source;
        this._model = model;
        this._explanations = explanations;
    }

    get expected() { return this._expected; }
    get source() { return this._source; }
    get model() { return this._model; }
    get explanations() { return this._explanations; }
}


// 888     888 d8b                                 
// 888     888 Y8P                                 
// 888     888                                     
// Y88b   d88P 888  .d88b.  888  888  888 .d8888b  
//  Y88b d88P  888 d8P  Y8b 888  888  888 88K      
//   Y88o88P   888 88888888 888  888  888 "Y8888b. 
//    Y888P    888 Y8b.     Y88b 888 d88P      X88 
//     Y8P     888  "Y8888   "Y8888888P"   88888P' 

export class View {

    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (!view.hasOwnProperty('type')) {
            return false;
        }

        return true
    }

    /**
     * @param {string} type 
     */
    constructor(type) {
        this._type = type;
    }

    get type() { return this._type; }
}

export class Experiment extends View {
    
    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!View.guard(view)) { return false; }
        if (!view.hasOwnProperty('tasks')) { 
            console.warn('Experiment has no tasks');
            return false;
        }
        if (!view.hasOwnProperty('question')) {
            console.warn('Experiment has no question');
            return false;
        }
        for (let task of view.tasks) {
            if (!Task.guard(task)) { return false; }
        }
        if (!Question.guard(view['question'])) { return false; }

        return true;
    }

    /**
     * @param {object} view
     */
    constructor(view) {
        super(view['type']);
        /** @type {Question} */
        this._question = new Question(view['question']);
        /** @type {Array<Task>} */
        this._tasks = view['tasks'];
        /** @type {string} */
        this._title = view['title'] ? view['title']: '';
        /** @type {string} */
        this._desc = view['desc'] ? view['desc']: '';
        /** @type {boolean} */
        this._is_training = view['is_training'] ? view['is_training']: false;
        /** @type {boolean} */
        this._show_progression_bar = view['show_progression_bar'] ? view['show_progression_bar']: false;
        this._timer = view.hasOwnProperty('timer') ? parseInt(view['timer']): -1; // -1 if no timer (otherwise it's the max timer).
    }
    
    get desc() { return this._desc; }
    get is_training() { return this._is_training; }
    get question() { return this._question; }
    get show_progression_bar() { return this._show_progression_bar; }
    get tasks() { return this._tasks; }
    get timer() { return this._timer; }
    get title() { return this._title; }
}

export class Form extends View {

    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!View.guard(view)) { return false; }
        if (!view.hasOwnProperty('questions')) {
            console.warn('Form has no question');
            return false;
        }
        for (let question of view['questions']) {
            if (!Question.guard(question)) { return false; }
        }
        return true;
    }

    /**
     * @param {object} view
     */
    constructor(view) {
        super(view['type']);
        /** @type {Array<Question>} */
        this._questions = view['questions'].map(q => new Question(q));        
    }

    get questions() { return this._questions; }
}

export class Desc extends View {
    
    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        return true;
    }

    /**
     * @param {object} view
     */
    constructor(view) {
        super(view['type']);
        this._title       = view['title'] ? view['title']: '';
        this._body_text   = view['body_text'] ? view['body_text']: '';
        this._button_text = view['button_text'] ? view['button_text']: 'Next';
        this._with_button = view['with_button'] ? view['with_button']: false;
        this._save        = view['save'] ? view['save']: false; // Attention si on veut mettre vrai, mettre une autre condition (ici on veut juste voir si save existe).
    }
    
    get title() { return this._title; }
    get body_text() { return this._body_text; }
    get button_text() { return this._button_text; }
    get with_button() { return this._with_button; }
    get save() { return this._save; }
}
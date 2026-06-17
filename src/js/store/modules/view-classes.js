// @ts-check

export class EnumQuestionOptions {
    static #_INLINE = 'inline'; // Checkbox, radio.
    static #_LIMIT_VALUES = 'limit_values'; // Checkbox, radio, range.
    static #_DISPLAY_VALUE = 'display_value'; // Range.
    static #_MAX = 'max'; // Range.
    static #_MIN = 'min'; // Range.
    static #_STEP = 'step'; // Range.
    static #_COLORS = 'css_class_colors'; // Buttons.

    // Accessors for "get" functions only (no "set" functions)
    static get INLINE() { return this.#_INLINE; }
    static get LIMIT_VALUES() { return this.#_LIMIT_VALUES; }
    static get DISPLAY_VALUE() { return this.#_DISPLAY_VALUE; }
    static get MAX() { return this.#_MAX; }
    static get MIN() { return this.#_MIN; }
    static get STEP() { return this.#_STEP; }
    static get COLORS() { return this.#_COLORS; }
}

class BreakForm {

    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!view.hasOwnProperty('index')) {
            console.warn('BreakForm has no index');
            return false;
        }
        return true
    }

    /**
     * @param {number} index 
     * @param {string} text
     */
    constructor(index, text = '') {
        this._index = index;
        this._text = text;
    }

    get index() { return this._index; }
    get text() { return this._text; }
}

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
        this._options = view['options'] ? view['options']: {};
    }

    get type() { return this._type; }
    get answers() { return this._answers; }
    get primary_text() { return this._primary_text; }
    get secondary_text() { return this._secondary_text; }
    get options() { return this._options; }
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
        if (view.hasOwnProperty('input')) {
            if (!LabelOrImage.guard(view['input'])) { return false; }
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
     * @param {object} view
     */
    constructor(view) {
        /** @type {Array<number|string>} */
        this._expected = typeof view['expected'] == 'number' ? [view['expected']]: view['expected']; // Array of correct indexes (only an integer it's for radio answers). Have to be the same length of number of choices.
        /** @type {LabelOrImage | undefined} */
        this._source = view.hasOwnProperty('input') ? view['input']: undefined;
        /** @type {LabelOrImage | undefined} */
        this._model = view.hasOwnProperty('model') ? view['model']: undefined;
        /** @type {Array<LabelOrImage>} */
        this._explanations = view.hasOwnProperty('explanations') ? view['explanations']: [];
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
     * @param {string} id 
     */
    constructor(type, id = '') {
        this._id = id;
        this._type = type;
    }

    get type() { return this._type; }
    get id() { return this._id; }
}

/* -------------------------------------------------------------------------- */
/*                                 Experiment                                 */
/* -------------------------------------------------------------------------- */


export class Experiment extends View {
    
    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!View.guard(view)) { return false; }
        if (!view.hasOwnProperty('instances')) { 
            console.warn('Experiment has no instance');
            return false;
        }
        if (!view.hasOwnProperty('question')) {
            console.warn('Experiment has no question');
            return false;
        }
        for (let task of view['instances']) {
            if (!Task.guard(task)) { return false; }
        }
        if (!Question.guard(view['question'])) { return false; }

        return true;
    }

    /**
     * @param {object} view
     */
    constructor(view) {
        super(view['type'], view.hasOwnProperty('view_id') ? view['view_id']: '');
        /** @type {Question} */
        this._question = new Question(view['question']);
        /** @type {string} */
        this._title = view.hasOwnProperty('title') ? view['title']: '';
        /** @type {string} */
        this._desc = view.hasOwnProperty('desc') ? view['desc']: '';
        /** @type {boolean} */
        this._is_training = view.hasOwnProperty('is_training') ? view['is_training']: false;
        /** @type {boolean} */
        this._show_progression_bar = view.hasOwnProperty('show_progression_bar') ? view['show_progression_bar']: false;
        /** @type {number} */
        this._timer = view.hasOwnProperty('timer') ? parseInt(view['timer']): -1; // -1 if no timer (otherwise it's the max timer).
        /** @type {number} */
        this._time_exceeded_timer = view.hasOwnProperty('time_exceeded_timer') ? parseInt(view['time_exceeded_timer']): -1; // -1 if no timer (otherwise it's the max timer).
        /** @type {boolean} */
        this._randomize = view.hasOwnProperty('randomize') ? view['randomize']: false;
        /** @type {boolean} */
        this._feedback_answer_activated = view.hasOwnProperty('feedback_answer_activated') ? view['feedback_answer_activated']: false;
        /** @type {string} */
        this._feedback_answer_correct = view.hasOwnProperty('feedback_answer_correct') ? view['feedback_answer_correct']: '';
        /** @type {string} */
        this._feedback_answer_wrong = view.hasOwnProperty('feedback_answer_wrong') ? view['feedback_answer_wrong']: '';
        /** @type {boolean} */
        this._feedback_answer_show_expected = view.hasOwnProperty('feedback_answer_show_expected') ? view['feedback_answer_show_expected']: false;
        /** @type {string} */
        this._feedback_answer_expected_text = view.hasOwnProperty('feedback_answer_expected_text') ? view['feedback_answer_expected_text']: '';

        /** @type {Array<Task>} */
        this._tasks = [];
        for (let task of view['instances']) {
            this._tasks.push(new Task(task));
        }
        this._order = [...Array(this._tasks.length).keys()];
        if (this._randomize) {
            this._order = this._fisherYatesShuffleImmutable(this._order);
            let tasks = this._order.map(i => this._tasks[i]);
            this._tasks = [...tasks];
        }
    }

    /**
     * @param {Array} array
     * @returns {Array}
     */
    _fisherYatesShuffleImmutable(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]]; // swap.
        }
        return copy;
    }      
    
    get desc() { return this._desc; }
    get is_training() { return this._is_training; }
    get order() { return this._order; }
    get question() { return this._question; }
    get randomize() { return this._randomize; }
    get show_progression_bar() { return this._show_progression_bar; }
    get tasks() { return this._tasks; }
    get timer() { return this._timer; }
    get time_exceeded_timer() { return this._time_exceeded_timer; }
    get title() { return this._title; }
    get feedback_answer_activated() { return this._feedback_answer_activated; }
    get feedback_answer_correct() { return this._feedback_answer_correct; }
    get feedback_answer_wrong() { return this._feedback_answer_wrong; }
    get feedback_answer_show_expected() { return this._feedback_answer_show_expected; }
    get feedback_answer_expected_text() { return this._feedback_answer_expected_text; }
}

/* -------------------------------------------------------------------------- */
/*                                  ChainExp                                  */
/* -------------------------------------------------------------------------- */

export class ChainExperiment extends View {
    
    /**
     * Check if json is compatible.
     * @param {object} view 
     */
    static guard(view) {
        if (typeof view !== 'object') { return false; }
        if (!View.guard(view)) { return false; }
        return true;
    }

    /**
     * @param {object} view
    */
    constructor(view) {
        super(view['type'], view.hasOwnProperty('view_id') ? view['view_id']: '');
        /** @type {string} */
        this._desc = view.hasOwnProperty('desc') ? view['desc']: '';
        /** @type {string[]} */
        this._images = view.hasOwnProperty('images') ? view['images']: [];
        /** @type {string[]} */
        this._labels = view.hasOwnProperty('labels') ? view['labels']: [];
        /** @type {number} */
        this._truth = view.hasOwnProperty('truth') ? view['truth']: -1; // Index of the correct label.
        /** @type {number} */
        this._timer = view.hasOwnProperty('timer') ? parseInt(view['timer']): -1; // -1 if no timer (otherwise it's the max timer).
        /** @type {boolean} */
        this._confidence = view.hasOwnProperty('confidence') ? view['confidence']: false;
        /** @type {boolean} */
        this._show_rewards = view.hasOwnProperty('show_rewards') ? view['show_rewards']: false;
        this._current_image_index = 0;
    }

    get confidence() { return this._confidence; }
    get images() { return this._images; }
    get labels() { return this._labels; }
    get show_rewards() { return this._show_rewards; }
    get timer() { return this._timer; }

    get current_image_index() { return this._current_image_index; }
    set current_image_index(index) { this._current_image_index = index; }

    get truth() { return this._truth; }
}


/* -------------------------------------------------------------------------- */
/*                                    Form                                    */
/* -------------------------------------------------------------------------- */

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
        if (view.hasOwnProperty('break')) {
            if (!BreakForm.guard(view['break'])) { return false; }
        }
        return true;
    }

    /**
     * @param {object} view
     */
    constructor(view) {
        super(view['type'], view.hasOwnProperty('view_id') ? view['view_id']: '');
        /** @type {Array<Question>} */
        this._questions = view['questions'].map(q => new Question(q));
        /** @type {BreakForm} */
        this._break = view.hasOwnProperty('break') ? view['break']: undefined;
    }

    get break() { return this._break; }
    get questions() { return this._questions; }
}


/* -------------------------------------------------------------------------- */
/*                                    Desc                                    */
/* -------------------------------------------------------------------------- */

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
        super(view['type'], view.hasOwnProperty('view_id') ? view['view_id']: '');
        this._body_text   = view.hasOwnProperty('body_text') ? view['body_text']: '';
        this._button_text = view.hasOwnProperty('button_text') ? view['button_text']: 'Next';
        this._countdown   = view.hasOwnProperty('countdown') ? 
                                typeof view['countdown'] == 'number' ? view['countdown']: 60
                            : undefined;
        /** @type {boolean|undefined} */                    
        this._score       = view.hasOwnProperty('score') ? view['score']: undefined;
        this._title       = view.hasOwnProperty('title') ? view['title']: '';
        this._with_button = view.hasOwnProperty('with_button') ? view['with_button']: false;
    }
    
    get body_text() { return this._body_text; }
    get button_text() { return this._button_text; }
    get countdown() { return this._countdown; }
    get score() { return this._score; }
    get title() { return this._title; }
    get with_button() { return this._with_button; }
}
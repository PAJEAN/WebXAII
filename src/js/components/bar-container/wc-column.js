/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences';

try {
    (function() {
        const PAGE_NAME = COMPONENT_NAMES.BAR_CONTAINER;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                /* -- TYPES -- */
                /* Positioning */
                /* Display & Box Model */
                /* Color */  
                /* Text */
                /* Other */

                /* Import base css */
                ${css.toString()}

                .src-container, .target-container {
                    /* Display & Box Model */
                    display: flex;
                    flex-direction: column;
                    margin-top: 10px;
                }
                .container-header {
                    /* Display & Box Model */
                    border-radius: 15px;
                    box-shadow: var(--box-shadow);
                    padding: 5px;
                    /* Color */
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                }
                .bar-container {
                    /* Display & Box Model */
                    height: var(--bar-height);
                    width: calc(var(--col-number) * var(--bar-cell-width));
                    margin: 1.0px 0;
                    border-radius: 20px;
                    /* Color */
                    background-color: rgba(var(--surface-color));
                }
                .active {
                    background: rgb(var(--secondary-color));
                }
                .error {
                    color: rgb(var(--error-color));
                    max-height: 300px;
                }
                .correct {
                    /* Display & Box Model */
                    max-height: 300px;
                    padding: 5px 15px;
                    /* Color */
                    color: rgb(var(--primary-color));
                    /* Text */
                    font-size: 16px;
                }
                wc-modal .bar-container {
                    margin: 0 auto;
                }
                .text-modal {
                    /* Display & Box Model */
                    margin: 10px 0;
                    /* Text */
                    font-size: 30px;
                    text-align: center;
                }
            </style>

            <div id="main">
                <div class="${css.locals.flex}" style="--f__ai: flex-start; --f__g: 150px">
                    <div class="container-header">
                        <${COMPONENT_NAMES.BAR_CONTAINER_HEADER}></${COMPONENT_NAMES.BAR_CONTAINER_HEADER}>
                        <div class="src-container"></div>
                    </div>
                    <div class="container-header">
                        <${COMPONENT_NAMES.BAR_CONTAINER_HEADER}></${COMPONENT_NAMES.BAR_CONTAINER_HEADER}>
                        <div class="target-container ${css.locals.flex}" style="--f__fd: column;"></div>
                    </div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super(); // No shadowroot because drag n drop doesn't work.
            }

            _init() {
                /*** Ordering state ***/
                (() => {
                    if (store.state[keys.s_ordering].length == 0) {
                        store.dispatch(keys.a_randomize_profils, {});
                        store.dispatch(keys.a_init_ordering, {});
                    }
                })();
                
                /*** Bars ***/
                (() => {
                    let bars = [store.state[keys.s_profil_min], ...store.state[keys.s_profils], store.state[keys.s_profil_max]];
                    
                    for (let _ of bars) { /* Div src and target containers */
                        let div = document.createElement('div');
                        div.classList.add('bar-container');
                        this.container.appendChild(div.cloneNode(true));
                        this.src_container.appendChild(div.cloneNode(true));
                    }

                    let index_src = 0;
                    for (let value of bars) {
                        /* Bar */
                        let bar = document.createElement(COMPONENT_NAMES.BAR);
                        let is_min_max_profil = value == store.state[keys.s_profil_min] || value == store.state[keys.s_profil_max]; // Min or max profil.
                        bar.setAttribute('data-values',    value);
                        bar.setAttribute('data-draggable', !is_min_max_profil);
                        if (!is_min_max_profil) {
                            bar.addEventListener('dragstart',  this._dragStart.bind(this));
                        }
                        /* Adding bar */
                        let index = store.state[keys.s_ordering].findIndex(el => el && el.profil == value);
                        if (index != -1) {
                            this.container.children[index].appendChild(bar);
                            bar.intensity = store.state[keys.s_ordering][index].intensity;
                        } else {
                            this.src_container.children[index_src].appendChild(bar);
                            index_src += 1;
                        }
                    }
                    // Update constraints and select.
                    this._updateStateBars();
                })();
            }

            _initEvents() {
                this.container.addEventListener('dragenter',  this._dragEnter.bind(this));
                this.container.addEventListener('dragover',   this._dragOver.bind(this));
                this.container.addEventListener('drop',       this._drop.bind(this));
                this.src_container.addEventListener('dragenter',  this._dragEnter.bind(this));
                this.src_container.addEventListener('dragover',   this._dragOver.bind(this));
                this.src_container.addEventListener('drop',       this._drop.bind(this));
                this.addEventListener('dragend', this._dragEnd.bind(this));
            }

            _updateStateBars() {
                // Check constraints of all bars (update warning container).
                let profils = this.container.querySelectorAll(COMPONENT_NAMES.BAR);
                for (let i = profils.length - 1; i >= 0; i--) {
                    let check = this._checkConstraints(profils[i]); // Check if the modification of this bar change the attribute.
                    if (check.pass) {
                        profils[i].index_violate_constraint = -1;
                        profils[i].hideWarning();
                    } else {
                        profils[i].index_violate_constraint = check.index_constraint;
                        profils[i].displayWarning();
                    }
                }

                // Display/Hide intensities (update select container).
                if (profils.length >= store.state[keys.g_profils_length]) {
                    for (let k = 1; k < profils.length; k++) {
                        profils[k].displaySelect();
                        /* According to constraints edit intensity */
                        for (let i = profils.length - 1; i >= 0; i--) {
                            if (profils[i].index_violate_constraint != -1) {
                                for (let j = profils[i].index_violate_constraint + 1; j <= i; j++) {
                                    profils[j].intensity = 1;
                                    profils[j].disabledSelect();
                                }
                            }
                        }
                    }
                } else {
                    profils.forEach(el => {
                        el.hideSelect()
                    });
                }
            }

            _checkConstraints(target_bar) {
                let result = {
                    pass: false,
                    index_constraint: -1, // If a constraint is violated, it's the index of the responsible bar.
                    index_bar: -1 // Targeted bar.
                };

                let children = Array.from(this.container.children); // Index of the bar in the targeted container.
                let index = children.findIndex(el => {
                    return el == target_bar.parentNode;
                });
                
                if (index != -1) {
                    let target_values = target_bar.value.split('');

                    for (let i = 0; i < index; i++) {
                        let src_bar = children[i].firstChild;
                        if (src_bar) {
                            let src_values = src_bar.value.split('');
                            let equal = 0;
                            let src_red = 0;
                            let target_red = 0;
                            for (let j = 0; j < src_values.length; j++) {
                                if (src_values[j] == '0') {
                                    src_red++;
                                }
                                if (target_values[j] == '0') {
                                    target_red++;
                                }
                                if (src_values[j] == '0' && target_values[j] == '0') {
                                    equal++;
                                }
                            }

                            if (equal > 0 && (
                                (i < index && (src_red == equal && target_red > src_red)) ||
                                (i > index && (target_red == equal && src_red > target_red))
                            )) {
                                result.index_constraint = i;
                                result.index_bar = index;
                                return result;
                            }
                        }
                    }
                }

                result.pass = true;
                result.index_bar = index;
                return result;
            }

            /**
             * When a bar is dragged.
             * @param {DragEvent} ev 
             */
            _dragStart(ev) {
				ev.dataTransfer.setData('text/plain', ev.target.id);
                ev.target.opacity = 0.4;
                
                let bars = Array.from(this.container.children);
                this._index_drag_from_target = bars.findIndex(el => el.firstChild && el.firstChild.id == ev.target.id);
			}

            /**
             * When users drop items, they moved before the space-div.
             * @param {DragEvent} ev 
             */
            _drop(ev) {
                ev.preventDefault();
               
                let data = ev.dataTransfer.getData('text/plain');
                let bar = document.getElementById(data); // Avoid to drag'n drop everything.
                if (bar) {
                    let is_src_container = true;
                    let active = this.src_container.querySelector('.active'); // Drop on the active cell.
                    if (!active) {
                        active = this.container.querySelector('.active');
                        is_src_container = false;
                    }

                    if (active && active.children.length == 0) {
                        bar.opacity = 1;
                        bar.resetIntensity();
                        bar.activatedSelect();
                        is_src_container && bar.hideSelect();
                        is_src_container && bar.hideWarning();
                        active.appendChild(bar);

                        /* Update store */
                        let new_index = Array.from(this.container.children).findIndex(el => el == bar.parentNode); // Index of the bar in the targeted container.
                        if (!is_src_container) {
                            store.dispatch(keys.a_update_order, {index: new_index, profil: bar.value});
                        } else if (this._index_drag_from_target != -1) { // Origin from targeted container.
                            store.dispatch(keys.a_update_order, {index: this._index_drag_from_target, profil: null});
                        }

                        // Update constraints and select.
                        this._updateStateBars();
                    }
                } else {
                    this._dragEnd();
                }
            }

            /**
             * 
             * @param {DragEvent} ev 
             */
            _dragOver(ev) {
                ev.preventDefault();
                ev.dataTransfer.dropEffect = 'move';
            }

            /**
             * When users enter in a droppable item.
             * @param {DragEvent} ev 
             */
            _dragEnter(ev) {
                ev.preventDefault();

                Array.from(this.src_container.children).forEach(el => {
                    el.classList.remove('active');
                });
                Array.from(this.container.children).forEach(el => {
                    el.classList.remove('active');
                });
                if (ev.target.classList.contains('bar-container')) {
                    ev.target.classList.add('active');
                }
            }

            /**
             * Reset display and attributes when users click out of the div (or a unauthorized tag is drag's drop).
             */
            _dragEnd() {
                Array.from(this.container.children).forEach(el => {
                    el.classList.remove('active');
                });
                Array.from(this.src_container.children).forEach(el => {
                    el.classList.remove('active');
                });

                this.container.querySelectorAll(COMPONENT_NAMES.BAR).forEach(el => {
                    el.opacity = 1;
                });
                this.src_container.querySelectorAll(COMPONENT_NAMES.BAR).forEach(el => {
                    el.opacity = 1;
                });
                this.content.querySelectorAll('.drag-image').forEach(el => {
                    el.remove();
                });
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main');
                this.src_container = this.content.querySelector('.src-container');
                this.container = this.content.querySelector('.target-container');
                /* Attribute */
                this._index_drag_from_target = true; // Index if the bar is drag from targeted container.
                /* Init */
                this._init();
                this._initEvents();
                /* Events */
                this.unsubscribe = store.events.subscribe('stateChange', () => {
                    console.log('STATE CHANGE !');
                });
            }
          
            disconnectedCallback () {
                this.unsubscribe();
            }
        });
    })();
}
catch (err) {
    console.error(err);
}
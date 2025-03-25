/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';

try {
    (function() {
        const COMPONENT_NAME = COMPONENT_NAMES.ALERT;
        
        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                /* -- TYPES -- */
                /* Positioning */
                /* Display & Box Model */
                /* Color */  
                /* Text */
                /* Other */

                ${css.toString()}

                .alert {
                    /* Display & Box Model */
                    border-radius: 10px;
                    margin-bottom: 15px;
                    padding: 20px;
                    opacity: 1;
                    /* Color */
                    background-color: #F44336;
                    color: white;
                    /* Other */
                    transition: opacity 0.6s;
                }
                .alert.success {
                    background-color: #04AA6D;
                }
                .alert.info {
                    background-color: #2196F3;
                }
                .alert.warning {
                    background-color: #FF9800;
                }
                .closebtn {
                    /* Positioning */
                    float: right;
                    /* Display & Box Model */
                    margin-left: 15px;
                    line-height: 20px;
                    /* Color */
                    color: white;
                    /* Text */
                    font-weight: bold;
                    font-size: 22px;
                    /* Other */
                    cursor: pointer;
                    transition: 0.3s;
                }

                .closebtn:hover {
                    color: black;
                }

            </style>
            
            <div id="main">
                <div class="alert">
                    <span class="closebtn">&times;</span>
                    <slot name="alert-text"><strong>Danger!</strong> Indicates a dangerous or potentially negative action.</slot>
                </div>
            </div>

        `;
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'}); /* ShadowRoot */
            }

            close() {
                this.style.display = 'none';
            }

            _init() {
                let types = ['success', 'info', 'warning'];
                if (this.hasAttribute('data-type')) {
                    let type = this.getAttribute('data-type');
                    if (types.includes(type)) {
                        let alert = this.content.querySelector('.alert');
                        alert.classList.add(type);
                    }
                }
            }

            _initEvents() {
                let close_button = this.content.querySelector('.closebtn');
                close_button.addEventListener('click', () => {
                    this.close();
                });
            }
          
            connectedCallback() {
                this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.shadowRoot.querySelector('#main');
                /* Init */
                this._init();
                this._initEvents();
            }
          
            disconnectedCallback() {}
        });
    })();
}
catch (err) {
    console.error(err);
}
/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from './__namespaces__';

try {
    (function() {
        const COMPONENT_NAME = COMPONENT_NAMES.BUTTON;
        
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

                .container {
                    /* Positioning */
                    /* Display & Box Model */
                    box-shadow: var(--box-shadow);
                    border-radius: 10px;
                    padding: 5px 0;
                    /* Color */
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                    color: white;
                    /* Text */
                    font-size: 32px;
                    text-align: center;
                    text-transform: uppercase;
                    /* Other */
                    cursor: pointer;
                    transition: all 0.2s;
                    
                }
                .container:hover {
                    border: 1px white solid;
                }
                .container:active {
                    box-shadow: none;
                }
            </style>
            
            <div id="main">
                <div class="container">
                    <div class="text">TEXT</div>
                </div>
            </div>

        `;
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'}); /* ShadowRoot */
            }

            get width() { return this.content.style.width; }
            set width(new_value) {
                this.content.style.width = `${new_value}px`;
            }
          
            connectedCallback() {
                this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.shadowRoot.querySelector('#main');

                if (this.hasAttribute('data-text')) {
                    this.content.querySelector('.text').textContent = this.getAttribute('data-text');
                }
                if (this.hasAttribute('data-width')) {
                    this.width = this.getAttribute('data-width');
                }
            }
          
            disconnectedCallback() {}
        });
    })();
}
catch (err) {
    console.error(err);
}
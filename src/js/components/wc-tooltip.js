/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';

try {
    (function() {
        const COMPONENT_NAME = COMPONENT_NAMES.TOOLTIP;
        
        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                /* -- TYPES -- */
                /* -- https://9elements.com/css-rule-order/ -- */
                /* Positioning */
                /* Display & Box Model */
                /* Color */  
                /* Text */
                /* Other */

                :host {
                    --background-color: black;
                    --text-color: #fff;
                }

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .tooltip {
                    /* Positioning */
                    position: relative;
                    /* Display & Box Model */
                    display: inline-block;
                }

                .tooltip .tooltip-hidden {
                    /* Positioning */
                    position: absolute;
                    z-index: 100;
                    /* Display & Box Model */
                    border-radius: 6px;
                    width: max-content;
                    max-width: 350px;
                    padding: 5px 10px;
                    visibility: hidden;
                    /* Color */
                    background-color: var(--background-color);
                    color: var(--text-color);
                    /* Text */
                    text-align: left;
                }

                .tooltip.top .tooltip-hidden {
                    bottom: calc(100% + 5px);
                }

                .tooltip.right .tooltip-hidden {
                    left: calc(100% + 5px);
                }

                .tooltip.bottom .tooltip-hidden {
                    top: calc(100% + 5px);
                }

                .tooltip.left .tooltip-hidden {
                    right: calc(100% + 5px);
                }

                /* Arrows */
                .tooltip .tooltip-hidden::after {
                    /* Positioning */
                    position: absolute;
                    /* Display & Box Model */
                    border-style: solid;
                    border-width: 5px;
                    /* Other */
                    content: "";
                }

                .tooltip.top .tooltip-hidden::after {
                    /* Positioning */
                    left: 50%;
                    top: 100%;
                    /* Display & Box Model */
                    border-color: var(--background-color) transparent transparent transparent;
                    margin-left: -5px;
                }

                .tooltip.bottom .tooltip-hidden::after {
                    /* Positioning */
                    bottom: 100%;
                    left: 50%;
                    /* Display & Box Model */
                    margin-left: -5px;
                    border-color: transparent transparent var(--background-color) transparent;
                }

                .tooltip.left .tooltip-hidden::after {
                    /* Positioning */
                    left: 100%;
                    top: 50%;
                    /* Display & Box Model */
                    border-color: transparent transparent transparent var(--background-color);
                    margin-top: -5px;
                    
                }

                .tooltip.right .tooltip-hidden::after {
                    /* Positioning */
                    right: 100%;
                    top: 50%;
                    /* Display & Box Model */
                    border-color: transparent var(--background-color) transparent transparent;
                    margin-top: -5px;
                }
                
                .tooltip:hover .tooltip-hidden {
                    visibility: visible;
                }
            </style>
            
            <div id="main">
                <div class="tooltip">
                    <div class="tooltip-hidden"><slot name="tooltip-hidden">Hidden</slot></div>
                    <div class="tooltip-visible"><slot name="tooltip-visible">Visible</slot></div>
                </div>
            </div>

        `;
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'}); /* ShadowRoot */
            }

            /**
             * Allow to refresh positionning if the component is initialize with no content (and update after).
             */
            refresh() {
                let tooltip_visible = this.content.querySelector('.tooltip-visible');
                let tooltip_hidden = this.content.querySelector('.tooltip-hidden');
                switch (this.direction) {
                    case 'top':
                    case 'bottom':
                        tooltip_hidden.style.left = `${(tooltip_visible.clientWidth / 2) - (tooltip_hidden.clientWidth / 2)}px`;
                        break;
                    case 'left':
                    case 'right':
                        tooltip_hidden.style.top = `${(tooltip_visible.clientHeight / 2) - (tooltip_hidden.clientHeight / 2)}px`;
                        break;
                }
            }

            _init() {
                let tooltip = this.content.querySelector('.tooltip');
                tooltip.classList.add(this.direction);
                let tooltip_hidden = this.content.querySelector('.tooltip-hidden');
                tooltip_hidden.style.textAlign = this.text_align;
                this.refresh();
            }
          
            connectedCallback() {
                if (this.shadowRoot.children.length == 0) { // Prevent when a bar drag'n drop nested tooltip.
                    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                    this.content = this.shadowRoot.querySelector('#main');
                    /* Attributes */
                    this.direction = 'bottom';
                    if (this.hasAttribute('data-direction')) {
                        let direction = this.getAttribute('data-direction');
                        let possibilities = ['top', 'right', 'bottom', 'left'];
                        if (possibilities.includes(direction)) {
                            this.direction = direction;
                        }
                    }
                    /* Initialization */
                    customElements.whenDefined(COMPONENT_NAME).then(() => {
                        this._init();
                    });
                }
            }
          
            disconnectedCallback() {}
        });
    })();
}
catch (err) {
    console.error(err);
}
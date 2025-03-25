/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences'

try {
    (function() {
        const PAGE_NAME = COMPONENT_NAMES.BAR_CONTAINER_HEADER;

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
            
                .title {
                    /* Display & Box Model */
                    width: var(--bar-cell-width);
                    transform: rotate(200deg);
                    /* Text */
                    font-size: 16px;
                    font-weight: 500;
                    writing-mode: vertical-rl;
                    /* Other */
                    cursor: help;
                }
                wc-tooltip {
                    /* Positioning */
                    position: relative;
                    /* Display & Box Model */
                    display: flex;
                    align-items: end;
                }
            </style>

            <div id="main" class="${css.locals.flex}"></div>

        `;
        
        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            
            constructor () {
                super();
                this.attachShadow({mode: 'open'}); /* ShadowRoot */
            }

            _init () {
                /* Header */
                (() => {
                    let titles = store.state[keys.s_titles];
                    for (let title of titles) {
                        let tooltip = document.createElement(COMPONENT_NAMES.TOOLTIP);
                        tooltip.setAttribute('data-direction', 'bottom');
                        tooltip.innerHTML = /* html */`
                            <div slot="tooltip-hidden">${title.help}</div>
                            <div slot="tooltip-visible">
                                <div class="title ${css.locals.flex}" style="--f__ai: center">${title.name}</div>
                            </div>
                        `;
                        this.content.appendChild(tooltip);
                    }
                })();
            }
         
            connectedCallback () {
                this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.shadowRoot.querySelector('#main');
                /* Init */
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}
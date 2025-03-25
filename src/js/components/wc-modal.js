import { COMPONENT_NAMES } from './__namespaces__';

try {
    (function() {

        const COMPONENT_NAME = COMPONENT_NAMES.MODAL;
        
        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            #main {
                /* Display */
                display: none; /* Hidden by default */
                /* Position */
                position: fixed; /* Stay in place */
                left: 0;
                top: 0;
                z-index: 2; /* Sit on top */
                /* Size */
                height: 100vh;
                width: 100%;
            }
            
            /* Modal Content/Box */
            .modal {
                /* Display */
                display: flex;
                align-items: center;
                justify-content: center;
                /* Height */
                height: 100%;
                width: 100%;
            }

            /* The Close Button */
            .close {
                /* Color */
                color: white;
                /* Font */
                font-size: 42px;
                font-weight: bold;
                /* Position */
                position: relative;
                float: right;
                /* Size */
                height: 100%;
                padding: 0 10px;
            }

            .close:hover,
            .close:focus {
                color: black;
                cursor: pointer;
            }

            ::slotted(div) {
                background: #FF8066;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                width: 100%;
                min-height: 200px;
            }

            .rotate {
                transform: rotate(90deg) scale(1.25, 1.25);
            }

            .rotate .close {
                transform: scale(0.75, 0.75);
            }
        </style>
        <div id="main">
            
            <div class="modal" id="modal">
                <div>
                    <div class="close">&times;</div>
                    <slot name="modal-content">Some text in the Modal..</slot>
                </div>
            </div>
        </div>
        `
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'});
            }

            removeModal () {
                let parent = this.parentNode;
                if (parent) {
                    parent.removeChild(this);
                }
            }

            init () {
                let slotted_el = this.content.querySelector('slot').assignedElements(); // Get the node inside the slot.
                if (slotted_el.length > 0) {
                    let close_button = this.content.querySelector('.close');
                    close_button.addEventListener('click', () => { this.removeModal() });
                    this.content.addEventListener('click', (e) => {
                        if (e.target != slotted_el[0] && !Array.from(slotted_el[0].children).includes(e.target)) {
                            this.removeModal();
                        }
                    });
                    this.content.style.display = 'block';
                }
            }
          
            connectedCallback() {
                this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.shadowRoot.querySelector('#main');
                this.init();
            }
          
            disconnectedCallback() {}
        });
    })()
}
catch (err) {
    console.error(err);
}
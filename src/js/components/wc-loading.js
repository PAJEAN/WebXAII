/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from './__namespaces__';

try {
    (function() {
        const COMPONENT_NAME = COMPONENT_NAMES.LOADING;

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

                #main {
                    width: fit-content;
                    margin: 0 auto;
                }
                .container {
                    /* Positioning */
                    position: relative;
                    /* Display & Box Model */
                    border-radius: 15px;
                    /* Text */
                    text-align: center;
                }
                .loader {
                    /* Display & Box Model */
                    border: 16px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 16px solid #3498db;
                    margin: 30px auto 0 auto;
                    width: 120px;
                    height: 120px;
                    /* Other */
                    -webkit-animation: spin 2s linear infinite; /* Safari */
                    animation: spin 2s linear infinite;
                  }
                  /* Safari */
                  @-webkit-keyframes spin {
                    0% { -webkit-transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); }
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
            </style>
            <div id="main">
                <div class="container">
                    <div>Chargement</div>
                    <div class="loader"></div>
                </div>
            </div>
        `;
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {

            constructor() {
                super();
                /* Shadow Root */
                this.attachShadow({mode: 'open'});
            }
          
            connectedCallback() {
                this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.shadowRoot.querySelector('#main');
            }
          
            disconnectedCallback() {}
        });
    })();
}
catch (err) {
    console.error(err);
}
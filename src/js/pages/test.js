/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';

try {
    (function() {
        const PAGE_NAME = 'page-test';

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style></style>

            <div id="main">
                <${COMPONENT_NAMES.FORM}></${COMPONENT_NAMES.FORM}>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main');
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


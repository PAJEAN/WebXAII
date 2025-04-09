// @ts-check

/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';

try {
    (function() {
        const PAGE_NAME = PAGE_NAMES.TEST;

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
                guardView(PAGE_NAMES.TEST);

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


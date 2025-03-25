try {
    (function() {
        const COMPONENT_NAME = 'wc-boilerplate';
        
        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style></style>
            
            <div id="main"></div>

        `;
        
        window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'}); /* ShadowRoot */
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
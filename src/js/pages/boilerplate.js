try {
    const TAG_IDS = {
        main_page: 'main-page',
    };

    (function() {
        const PAGE_NAME = 'page-boilerplate';

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style></style>

            <div id="${TAG_IDS.main_page}"></div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector(`#${TAG_IDS.main_page}`);
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


try {
    (function() {
        const PAGE_NAME = 'page-end';

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                /* -- TYPES -- */
                /* Positioning */
                /* Display & Box Model */
                /* Color */  
                /* Text */
                /* Other */

                #main-page {
                    height: 100vh;
                }
                .card {
                    box-shadow: var(--box-shadow);
                }
            </style>

            <div id="main-page" class="container d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="card w-75 m-auto">
                        <div class="card-body">
                            <h3 id="score-title" class="card-title text-center">Thank you for your participation to the experiment.</h3>
                            <div id="score-value" class="text-center mt-4">Your average score was 74/100</div>
                        </div>
                    </div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _init() {
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                this._init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


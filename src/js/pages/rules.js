
/* CSS */
import css from 'CSS/style.css';
import test from 'CSS/var.css';

try {
    (function() {
        const PAGE_NAME = 'page-rules';

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

                /* Import more */
                ${test.toString()}

                :root {
                    --container-width: 460px;
                    --container-height: 300px;
                }
                #main-page {
                    height: 100vh;
                }
                .title {
                    text-align: center;
                    font-size: 28px;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                .container {
                    width: var(--container-width);
                    padding: 30px;
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                    box-shadow: var(--box-shadow);
                    border-radius: 10px;
                    text-align: justify;
                }
                i {
                    font-size: 14px;
                }
                a {
                    text-decoration: none;
                }
                .button:hover {
                    box-shadow: none;
                }
                .center {
                    text-align: center;
                }
            </style>

            <div id="main-page" class="d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="title backtest">Rules !</div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu sem pulvinar, ullamcorper elit lobortis, facilisis neque. Vestibulum viverra ligula neque, at facilisis ante maximus non. Nulla feugiat aliquam imperdiet.
                    <br><br>
                    Ut in est quis dui dapibus dapibus at eu nisl. Pellentesque a gravida diam, eu hendrerit ex. Etiam molestie eu libero vitae feugiat. Aenean id nulla in purus elementum convallis
                    <br><br>
                    <div class="center">
                        <a href="#/app"><button id="connexion-btn" type="button" class="btn btn-primary btn-lg text-uppercase w-100">Lancez le jeu</button></a>
                    </div>
                </div>
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


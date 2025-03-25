/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from 'JS/components/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences';
/* Utils */
import { MATRIX_URL } from 'JS/utils/constants';

try {
    (function() {
        const PAGE_NAME = 'page-app';

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

                #main-page {
                    min-height: 100vh;
                    overflow: auto;
                }
                #container {
                    transform-origin: top;
                }
                .main-container {
                    margin: 20px;
                }
                .tools {
                    /* Display & Box Model */
                    width: max-content;
                    margin: 0 auto 20px auto;
                    padding: 5px 15px;
                    border-radius: 10px;
                    box-shadow: var(--box-shadow);
                    /* Color */
                    background-color: rgba(var(--surface-color));
                    backdrop-filter: blur(5px);
                }
                .zoom {
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .zoom:hover {
                    transform: scale(1.15);
                }
                .zoom img {
                    width: 35px;
                    padding: 5px;
                }
                a {
                    text-decoration: none;
                }
            </style>

            <div id="main-page" class="${css.locals.flex} ${css.locals.background}" style="--f__fd: column; --f__ai: center">

                <div class="main-container ${css.locals.flex}" style="--f__fd: column; --f__ai: center">
                    <div class="${css.locals.flex}" style="--f__fd: column; --f__ai: center">
                        <div class="${css.locals.flex}" style="--f__g: 40px;">
                            <div class="${css.locals.flex} tools" style="--f__g: 20px; --f__jc: center;">
                                <div class="zoom ${css.locals.flex}" style="--f__jc: center; --f__ai: center;" id="zoom-plus" title="Zoom + (100%)">
                                    <img src="assets/img/zoom_plus.png" alt="Zoom plus">
                                </div>
                                <div class="zoom ${css.locals.flex}" style="--f__jc: center; --f__ai: center;" id="zoom-minus" title="Zoom - (100%)">
                                    <img src="assets/img/zoom_minus.png" alt="Zoom moins">
                                </div>
                                <a id="screenshot" class="zoom copie" download="canvas.png" title="Screenshot">
                                    <img src="assets/img/screenshot.png" alt="Screenshot">
                                </a>
                            </div>

                            <div class="save ${css.locals.flex}" style="--f__jc: center">
                                <a id="save" download="canvas.png">
                                    <${COMPONENT_NAMES.BUTTON} data-text="Enregistrer" data-width="300"></${COMPONENT_NAMES.BUTTON}>
                                </a>
                            </div>
                        </div>
                        <div class="info"></div>
                    </div>

                    <div id="container">
                        <${COMPONENT_NAMES.BAR_CONTAINER}></${COMPONENT_NAMES.BAR_CONTAINER}>
                    </div>

                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _init () {
                /* Edit css var */
                let css_property = document.querySelector(':root'); // Global :root.
                css_property.style.setProperty('--col-number', store.state[keys.g_titles_length]);
            }

            _initEvents() {
                let container = this.content.querySelector('#container');
                /*** Zooms ***/
                let zoom_plus  = this.content.querySelector('#zoom-plus');
                let zoom_minus = this.content.querySelector('#zoom-minus');
                zoom_plus.addEventListener('click', () => {
                    this.zoom_value += 0.05;
                    container.style.transform = `scale(${this.zoom_value})`;
                    zoom_plus.title = `Zoom + (${Math.round(this.zoom_value * 100)}%)`;
                    zoom_minus.title = `Zoom - (${Math.round(this.zoom_value * 100)}%)`;
                });
                zoom_minus.addEventListener('click', () => {
                    this.zoom_value -= 0.05;
                    container.style.transform = `scale(${this.zoom_value})`;
                    zoom_plus.title = `Zoom + (${Math.round(this.zoom_value * 100)}%)`;
                    zoom_minus.title = `Zoom - (${Math.round(this.zoom_value * 100)}%)`;
                });
                /*** Screenshot ***/
                let screenshot = this.content.querySelector(`#screenshot`);
                screenshot.addEventListener('click', () => {
                    this._screenshot(screenshot);
                });
                /*** Save ***/
                let save = this.content.querySelector(`#save`);
                save.addEventListener('click', () => {
                    save.removeAttribute('href'); // Reset href to avoid to keep track of old href.
                    this._saveResults();
                });
            }

            _screenshot(tag) {
                let space = 40;
                let radius = 15;
                let width = 350;
                let height = 1000;

                let canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.font = '50px Source Sans Pro';
                ctx.fillStyle = '#60BAAE';
                ctx.fillRect(0, 0, width, height);
                let results = store.state[keys.s_ordering];
                for (let i = 0; i < results.length; i++) {
                    let bar = results[i];
                    if (bar) {
                        let values = bar.profil.split('');
                        for (let j = 0; j < values.length; j++) {
                            ctx.beginPath();
                            ctx.arc(j * space + space, i * space + space, radius, 0, 2 * Math.PI);
                            ctx.fillStyle = values[j] == '0' ? 'darkred': 'green';
                            ctx.fill();
                        }
                        ctx.fillStyle = 'black';
                        ctx.fillText(bar.intensity, values.length * space + space, i * space + space);
                    }
                }
                let download = canvas.toDataURL('image/png');
                download = download.replace(/^data:image\/[^;]*/, 'data:application/octet-stream'); /* Change MIME type to trick the browser to downlaod the file instead of displaying it. */
                tag.href = download;
            }

            _saveResults() {
                function _newAlert(text, delay, type) {
                    let alert = document.createElement(COMPONENT_NAMES.ALERT);
                    alert.innerHTML = /* html */ `
                        <div slot="alert-text">${text}</div>
                    `;
                    if (type)  { alert.setAttribute('data-type', type); }
                    if (delay) { setTimeout(() => { alert.close(); }, delay); }
                    return alert;
                };

                let results = store.state[keys.s_ordering];

                /* Info tag */
                let info_tag = this.content.querySelector('.info');
                info_tag.innerHTML = '';

                if (store.state[keys.g_is_full]) {
                    this._screenshot(this.content.querySelector(`#save`));
                    axios.patch(MATRIX_URL, {uid: store.state.uid, matrix: results})
                    .then(function (res) {
                        info_tag.appendChild(_newAlert(`
                        Vos réponses ont été sauvegardées ! Vous pouvez quitter l’application. <br>
                        Grâce à vous et à votre expérience terrain, l’intelligence collective a été enrichie. <br>
                        Un grand merci pour votre participation et à très bientôt pour vous présenter le futur outil issu de ce travail de recherche !`, null, 'success'));
                    }, (err) => {
                        console.error(err);
                        info_tag.appendChild(_newAlert(`Une erreur s'est produite. Veuillez réaliser une capture d'écran de votre saisie !`, null, null));
                    });
                } else {
                    info_tag.appendChild(_newAlert(`Attention ! Veuillez finir de trier tous les profils et d'évaluer toutes les différences entre profils !`, 10000, null));
                }

                return results;
            }
            
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main-page');
                this.zoom_value = 1.0;
                /* Init */
                this._init();
                this._initEvents();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}
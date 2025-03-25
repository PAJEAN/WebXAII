import { USER_URL } from '../utils/constants.js';

try {
    (function() {
        const PAGE_NAME = 'page-adduser';

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`
            <link rel="stylesheet" href="css/style.css">

            <style>
                :root {
                    --container-width: 500px;
                }
                .height-percent {
                    height: 100%;
                }
                .height-vh {
                    height: 100vh;
                }
                .loading {
                    display: none;
                }
                .auth-container {
                    width: var(--container-width);
                    height: var(--container-width);
                    padding: 30px 35px;
                    background: rgb(var(--surface-color));
                    box-shadow: var(--pixel-box-shadow);
                }
                .title {
                    text-align: center;
                    font-size: 40px;
                    letter-spacing: 3px;
                }
                .sub-title {
                    text-align: center;
                    font-size: 20px;
                    letter-spacing: 3px;
                    padding: 10px 0 35px 0; 
                }
                .fields {
                    padding: 15px 0;
                    width: 100%;
                }
                .fields input {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 25px;
                    padding: 15px 10px 15px 50px;
                }
                .password {
                    box-shadow: var(--pixel-box-shadow);
                }
                .icon {
                    position: absolute;
                    width: 25px;
                    margin: 0 10px;
                }
                .signin-button {
                    margin: 10px 0 0 0;
                }
                .info {
                    text-align: center;
                    padding: 10px 5px;
                }
                .error {
                    color: #fd0505;
                }
                .correct {
                    color: #43c50c;
                }
            </style>

            <div id="main" class="height-vh flex" style="--f__ai: center; --f__jc: center;">
                <div class="loading">
                    <wc-loading></wc-loading>
                </div>
                <div class="auth-container">
                    <div class="title">Ajouter un utilisateur</div>
                    <div class="sub-title">Kyomed & IMT Mines Alès</div>

                    <div class="fields">
                        <div class="password flex" style="--f__ai: center;">
                            <img src="img/locked.png" alt="Cadena" class="icon">
                            <input type="password" placeholder="Saisissez le mot de passe">
                        </div>
                    </div>

                    <div class="fields">
                        <div class="password flex" style="--f__ai: center;">
                            <input type="text" placeholder="Saisissez l'identifiant">
                        </div>
                    </div>

                    <div class="signin-button">
                        <wc-button data-text="Connexion"></wc-button>
                    </div>

                    <div class="info"></div>
                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            connectUser(pwd, uid) {
                let auth_content = this.content.querySelector('.auth-container');
                let loading = this.content.querySelector('.loading');

                this.info_tag.classList.remove('correct');
                this.info_tag.classList.remove('error');

                auth_content.style.display = 'none';
                loading.style.display = 'block';

                console.log(uid);

                axios.patch(USER_URL, {pwd: pwd, uid: uid})
                .then((response) => {
                    const data = response.data; // Response: null or an object.
                    console.log(data);
                    if (data) {
                        auth_content.style.display = 'block';
                        loading.style.display = 'none';
                        this.info_tag.classList.add('correct');
                        this.info_tag.innerHTML = `L'utilisateur a été ajouté`;
                    }
                }, (err) => {
                    auth_content.style.display = 'block';
                    loading.style.display = 'none';
                    this.info_tag.classList.add('error');
                    this.info_tag.innerHTML = `Oups... Une erreur s'est produite !`;
                });
            }

            init() {
                /* Tags */
                let pwd = this.content.querySelector('input[type=password]');
                let uid = this.content.querySelector('input[type=text]');
                let login_button = this.content.querySelector('wc-button');
                /* Behaviors */
                login_button.addEventListener('click', () => {
                    this.connectUser(pwd.value, uid.value);
                });
            }
         
            connectedCallback () {
                this.appendChild(TEMPLATE.content.cloneNode(true));
                this.content = this.querySelector('#main');
                /* HTML tags */
                this.info_tag = this.content.querySelector('.info');
                /* Setup the page */
                this.init();
            }
          
            disconnectedCallback () {}
        });
    })();
}
catch (err) {
    console.error(err);
}


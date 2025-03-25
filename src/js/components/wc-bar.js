/* CSS */
import css from 'CSS/style.css';
/* Components */
import { COMPONENT_NAMES } from './__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/preferences';

try {
	(function() {
		const COMPONENT_NAME = COMPONENT_NAMES.BAR;
		
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
					height: var(--bar-height);
                }
				.left, .middle, .right {
					/* Display & Box Model */
					width: var(--bar-cell-content-width);
					height: var(--bar-cell-height);
					border-radius: 100%;
					border: 1.5px solid white;
					margin: 0 var(--bar-cell-margin);
				}
				.green-light {
					/* Display & Box Model */
					box-shadow:
						0 -2px 0 2px rgba(11, 149, 18, 0.5) inset,
						0 4px rgba(255, 255, 255, 0.25) inset;
					/* Color */
					background: #0EC518;
				}
				.red-light {
					/* Display & Box Model */
					box-shadow:
						0 -2px 0 2px rgba(201, 25, 25, 0.5) inset,
						0 4px rgba(255, 255, 255, 0.25) inset;
					/* Color */
					background: #E53030;
				}
				.select-container {
					margin-top: calc(calc(-1.5*var(--bar-cell-height)));
				}
				.blue {
					background: rgb(var(--secondary-color));
				}
				.yellow {
					background: rgb(var(--primary-color));
				}
				.intensity {
					/* Display & Box Model */
					height: var(--bar-cell-height);
					border: none;
					outline: none;
					box-shadow: var(--pixel-box-shadow);
					/* Text */
					text-transform: uppercase;
				}
				.warning-container {
					cursor: help;
				}
				.warning-container img {
					width: var(--bar-cell-height);
					margin-left: calc(var(--pixel-size) * 2);
				}
			</style>
			
			<div id="main" class="${css.locals.flex}" style="--f__g: 5px; --f__ai: center;">
				<div class="bar ${css.locals.flex}"></div>
				<div class="select-container ${css.locals.flex}" style="display: none;"></div>
				<div class="warning-container ${css.locals.flex}" style="display: none;">
					<${COMPONENT_NAMES.TOOLTIP}>
						<div slot="tooltip-hidden"></div>
						<div slot="tooltip-visible">
							<img src="assets/img/warning.png" alt="Warning">
						</div>
					</${COMPONENT_NAMES.TOOLTIP}>
				</div>
			</div>
		`;
	  
	  	window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
			  
			constructor() {
				super();
				this.attachShadow({mode: 'open'}); /* ShadowRoot */
			}

			/**
			 * Get and set profil of the bar.
			 */
			get value() { return this.hasAttribute('data-values') ? this.getAttribute('data-values'): null; }
			set value(new_value) {
				this.setAttribute('data-values', new_value);
			}

            get opacity() { return this.content.style.opacity; }
            set opacity (new_value) {
                this.content.style.opacity = new_value;
            }

            get isDraggable() { return this.content.draggable; }
            set isDraggable(new_value) {
                this.content.draggable = new_value;
				this.content.style.cursor = new_value ? 'grab': 'auto';
            }

			get intensity() {
				let select = this.content.querySelector('.intensity');
				return select.selectedIndex;
			}
			set intensity(new_value) {
				let select = this.content.querySelector('.intensity');
				select.selectedIndex = new_value;
				let event = new Event('change');
				select.dispatchEvent(event);
			}

			_init() {
				let bar = this.content.querySelector('.bar');
				/*** Bar ***/
				(() => {
					bar.innerHTML = '';
					let colors = this.value.split('');
					for (let i = 0; i < colors.length; i++) {
						let div = document.createElement('div');
						switch (i) {
							case 0:
								div.classList.add('left');
								break;
							case colors.length - 1:
								div.classList.add('right');
								break;
							default:
								div.classList.add('middle');
						}
						switch (colors[i]) {
							case '0':
								div.classList.add('red-light');
								break;
							case '1':
								div.classList.add('green-light');
								break;
						}
						bar.appendChild(div);
					}
				})();

				/*** Create select tag with options ***/
				(() => {
					let select_container = this.content.querySelector('.select-container');
					if (select_container.children.length == 0) {
						let select = document.createElement('select');
						select.classList.add('intensity', 'yellow');
						store.state[keys.s_select].forEach((el, i) => {
							let option = document.createElement('option');
							option.setAttribute('value', i);
							option.textContent = el;
							select.appendChild(option);
						});
						select_container.appendChild(select);
					}
				})();
			}

			_initEvents() {
				this.content.querySelector('.intensity').addEventListener('change', (ev) => {
					let select = this.content.querySelector('.intensity');
					if (ev.target.selectedIndex == 0) {
						select.classList.remove('blue');
						select.classList.add('yellow');
					} else {
						select.classList.remove('yellow');
						select.classList.add('blue');
					}
					/* Update store */
					store.dispatch(keys.a_update_intensity, {profil: this.value, intensity: this.intensity});
				});
			}

			/*** Freeze/Unfreeze select ***/
			activatedSelect() {
				let select = this.content.querySelector('.intensity');
				select.removeAttribute('disabled');
			}
			
			disabledSelect() {
				let select = this.content.querySelector('.intensity');
				select.setAttribute('disabled', '');
			}

			/*** Toggle select ***/
			displaySelect() {
				let select_container = this.content.querySelector('.select-container');
				select_container.style.display = 'flex';
				this.hideWarning();
			}

			hideSelect() {
				let select_container = this.content.querySelector('.select-container');
				select_container.style.display = 'none';
			}

			resetIntensity() {
				/** @type {HTMLSelectElement} */
				this.intensity = 0;
			}

			/*** Toggle warning container ***/
			displayWarning() {
				let warning_container = this.content.querySelector('.warning-container');
				warning_container.style.display = 'flex';
				let tooltip = this.content.querySelector(COMPONENT_NAMES.TOOLTIP);
				let hidden_div = tooltip.querySelector('div[slot=tooltip-hidden]');
				hidden_div.textContent = `Le profil n°${this.index_violate_constraint} est moins fragile.`;
				tooltip.refresh();
			}

			hideWarning() {
				let warning_container = this.content.querySelector('.warning-container');
				warning_container.style.display = 'none';
			}
			
			connectedCallback() {
				if (this.shadowRoot.children.length == 0) { // Prevent a drag'n drop nested bar.
					this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
					this.content = this.shadowRoot.querySelector('#main');
	
					if (this.hasAttribute('data-values')) {
						this.id = 'id-' + this.value;
						this._init();
						this._initEvents();
					}
	
					if (this.hasAttribute('data-draggable')) {
						this.isDraggable = this.getAttribute('data-draggable') === 'true' ? true: false;
					}

					this.index_violate_constraint = -1; // If this bar violate a constraint, keep the min index of the bar in charge.
				}
			}
		
		  	disconnectedCallback() {}
		});
  	})();
}
catch (err) {
  	console.error(err);
}
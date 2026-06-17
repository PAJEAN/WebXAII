/* Lib */
import { guardView, nextView } from 'JS/lib/view-manager';
/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';
/* Store */
import { store } from 'JS/store/index';
import { keys } from 'JS/store/modules/view';
import { ChainExperiment } from 'JS/store/modules/view-classes';

try {
    const TAG_IDS = {
        main_page: 'main-page',
        image: 'image-div',
        labels_list: 'labels-list-div',
        next_btn: 'next-btn',
        timer: 'timer-div',
        error: 'error-div',
        desc: 'desc-div',
        confidence: 'confidence-div',
        slider: 'slider-input',
        slider_value: 'slider-value-span',
        rewards: 'rewards-div',
        rewards_correct: 'rewards-correct-span',
        rewards_incorrect: 'rewards-incorrect-span'
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.CHAIN_EXPE;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style>
                .image-container {
                    width: 300px;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .confidence-value {
                    font-weight: bold;
                    min-width: 40px;
                    text-align: center;
                }
            </style>

            <div id="${TAG_IDS.main_page}" class="container-fluid vh-100 d-flex justify-content-center align-items-center">
                <div class="container">
                    
                    <!-- <div class="d-flex justify-content-between mb-4">
                        <div>Completion %</div>
                        <div>Time left: 7:00</div>
                    </div> -->

                    <h1 id="${TAG_IDS.desc}" class="mb-5 text-center">
                        Second Task: Please select the correct category for the image
                    </h1>

                    <div class="row g-4 align-items-stretch mt-5">

                        <!-- Image -->
                        <div class="col-12 col-lg-5 d-flex align-items-center justify-content-center">
                            <div id="${TAG_IDS.image}" class="image-container">
                                <img src="assets/datasets/felipe/dog.JPEG" alt="Image à classifier">
                            </div>
                        </div>

                        <!-- Liste des catégories -->
                        <form id="${TAG_IDS.labels_list}" class="col-12 col-lg-2">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="airplane">
                                <label class="form-check-label" for="airplane">Airplane</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="truck">
                                <label class="form-check-label" for="truck">Truck</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="car">
                                <label class="form-check-label" for="car">Car</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="ship">
                                <label class="form-check-label" for="ship">Ship</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="cat">
                                <label class="form-check-label" for="cat">Cat</label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="dog">
                                <label class="form-check-label" for="dog">Dog</label>
                            </div>
                        </form>

                        <!-- Confiance + validation -->
                        <div class="col-12 col-lg-5 d-flex flex-column justify-content-between">

                            <div id="${TAG_IDS.confidence}">
                                <h4 class="text-center mb-4">
                                    Confidence on Answer
                                </h4>
                                <div class="d-flex align-items-center gap-3 mb-4">
                                    
                                    <span>0</span>
    
                                    <input
                                        type="range"
                                        class="form-range"
                                        min="0"
                                        max="100"
                                        value="15"
                                        id="${TAG_IDS.slider}"
                                    >
    
                                    <span>100</span>
    
                                    <span id="${TAG_IDS.slider_value}"
                                        class="confidence-value">
                                        15
                                    </span>
                                </div>
                            </div>

                            <div id="${TAG_IDS.rewards}" class="text-body-secondary fs-5 d-none">
                                <div>Correct: Rrec - 1/2*(Rrec - conf*Rrec) = <span id="${TAG_IDS.rewards_correct}">0</span></div>
                                <div>Incorrect: Rrec - 1/2*(Rrec + conf*Rrec) = <span id="${TAG_IDS.rewards_incorrect}">0</span></div>
                            </div>

                            <div class="d-grid">
                                <button id="${TAG_IDS.next_btn}" class="btn btn-outline-secondary btn-lg">
                                    Validate
                                </button>
                            </div>

                        </div>

                    </div>

                    <div id="${TAG_IDS.timer}" class="text-center mt-5 fs-3"></div>

                    <div id="${TAG_IDS.error}" class="text-center text-danger"></div>

                </div>
            </div>

        `;

        window.customElements.define(PAGE_NAME, class extends HTMLElement {
            constructor() {
                super();
            }

            _clear_error() {
                let error_tag = this.content.querySelector(`#${TAG_IDS.error}`);
                error_tag.innerHTML = '';
            }

            _images() {
                if (this.current_view.current_image_index >= this.current_view.images.length) {
                    this._submit();
                    return;
                }

                let images_tag = this.content.querySelector(`#${TAG_IDS.image}`);
                images_tag.innerHTML = `<img src="${this.current_view.images[this.current_view.current_image_index]}" class="icon rounded img-thumbnail" alt="...">`;
            }

            _labels() {
                if (this.current_view.current_image_index >= this.current_view.images.length) { 
                    this._submit();
                    return;
                }

                let labels_tag = this.content.querySelector(`#${TAG_IDS.labels_list}`);
                labels_tag.innerHTML = '';
                for (let i = 0; i < this.current_view.labels.length; i++) {
                    let container = document.createElement('div');
                    container.classList.add('form-check');

                    let input = document.createElement('input');
                    input.classList.add('form-check-input');
                    input.type = 'radio';
                    input.name = 'labels';
                    input.id = `label${i + 1}`;
                    input.value = i.toString();

                    container.appendChild(input);

                    let label_tag = document.createElement('label');
                    label_tag.classList.add('form-check-label');
                    label_tag.htmlFor = `label${i + 1}`;
                    label_tag.textContent = this.current_view.labels[i];

                    container.appendChild(label_tag);
                    labels_tag.appendChild(container);
                }
            }

            _correct_rewards(cts, confidence) {
                return (cts - 0.5 * (cts - confidence / 100 * cts)).toFixed(2);
            }

            _incorrect_rewards(cts, confidence) {
                return (cts - 0.5 * (cts + confidence / 100 * cts)).toFixed(2);
            }

            /**
             * Waiting the loading of images before start the timer.
             */
            _secure_timer() {
                if (this.current_view.timer >= 0) {
                    let tag = this.content.querySelector(`#${TAG_IDS.timer}`);
                    tag.textContent = this.current_view.timer.toFixed(0);
                    tag.classList.remove('text-danger');

                    let tag_source_model = this.content.querySelector(`#${TAG_IDS.image}`);
                    let imgs = Array.from(tag_source_model.querySelectorAll('img'));
                    
                    Promise.all(imgs.map(async (img) => {
                        await img.decode();
                        return img;
                    })).then(() => {                        
                        this._timer();
                    }).catch((err) => {
                        console.error(err);
                        this._timer();
                    });
                }
            }

            _submit() {
                /** @type {HTMLFormElement} */
                let form = this.content.querySelector(`#${TAG_IDS.labels_list}`);
                let form_data = new FormData(form); // Index of the response (ou null).

                if (form_data.get('labels') == null && !this.time_exceeded_timer) {
                    let error_tag = this.content.querySelector(`#${TAG_IDS.error}`);
                    error_tag.textContent = 'Please select a label';
                    return;
                }

                let confidence = -1;
                if (this.current_view.confidence) {
                    let slider = this.content.querySelector(`#${TAG_IDS.slider}`);
                    confidence = parseInt(slider.value);
                }

                /* Save */
                store.dispatch(keys.a_update_save, {
                    instances: [{
                        answers: form_data.get('labels') == null ? null : parseInt(form_data.get('labels')),
                        confidence: confidence,
                        time: this.current_time,
                        is_time_exceeded: this.time_exceeded_timer,
                        expected: this.current_view.truth
                    }]
                });

                this.current_view.current_image_index += 1;

                if (this.current_view.current_image_index >= this.current_view.images.length || (form_data.get('labels') != null && parseInt(form_data.get('labels')) == this.current_view.truth)) {
                    store.dispatch(keys.a_update_experiment_scores, this.current_view.current_image_index - 1); // Number of the images seen.
                    nextView();
                } else {
                    this._init();
                }
            }

            /**
             * Displays a timer if required.
             */
            _timer() {
                function timer_text(time) {
                    return `Time left: ${time} secondes`;
                }
                let tag = this.content.querySelector(`#${TAG_IDS.timer}`);
                
                if (this.current_view.timer >= 0) {
                    tag.textContent = timer_text(this.current_view.timer.toFixed(0));
                    tag.classList.remove('text-danger');
                }

                let delta_time = 100;
                this.timer_id = window.setInterval(() => {
                    this.current_time += delta_time;
                    let current_time_second = this.current_time / 1000;

                    let remaining_time = this.current_view.timer - current_time_second;
                    
                    if (remaining_time <= 3) {
                        tag.classList.add('text-danger');
                    }
                    if (this.current_view.timer >= 0) {
                        if (current_time_second % 1 == 0) {
                            tag.textContent = timer_text((Math.round(remaining_time * 100) / 100).toFixed(0));
                        }
                        if (current_time_second >= this.current_view.timer) {
                            this.time_exceeded_timer = true;
                            this._submit(true);
                        }
                    }
                }, delta_time);
            }            

            _init() {
                this.timer_id && clearInterval(this.timer_id);
                this.current_time = 0;
                this.time_exceeded_timer = false;

                this._clear_error();
                this._images();
                this._labels();
                this._secure_timer();
            }

            _init_events() {
                let next_btn = this.content.querySelector(`#${TAG_IDS.next_btn}`);
                next_btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._submit();
                });
                
                if (this.current_view.show_rewards) {
                    this.content.querySelector(`#${TAG_IDS.rewards}`).classList.toggle('d-none');
                }
                
                if (this.current_view.confidence) {
                    const slider = this.content.querySelector(`#${TAG_IDS.slider}`);
                    const value = this.content.querySelector(`#${TAG_IDS.slider_value}`);

                    const REWARD_CTS = 3;
                    const correct_rewards = this.content.querySelector(`#${TAG_IDS.rewards_correct}`);
                    const incorrect_rewards = this.content.querySelector(`#${TAG_IDS.rewards_incorrect}`);
                    correct_rewards.textContent = this._correct_rewards(REWARD_CTS, parseInt(slider.value));
                    incorrect_rewards.textContent = this._incorrect_rewards(REWARD_CTS, parseInt(slider.value));
    
                    slider.addEventListener('input', () => {
                        value.textContent = slider.value;

                        if (this.current_view.show_rewards) {
                            correct_rewards.textContent = this._correct_rewards(REWARD_CTS, parseInt(slider.value));
                            incorrect_rewards.textContent = this._incorrect_rewards(REWARD_CTS, parseInt(slider.value));
                        }
                    });
                } else {
                    this.content.querySelector(`#${TAG_IDS.confidence}`).innerHTML = '';
                }
            }
         
            connectedCallback () {
                /* Guard */                
                let is_legit = guardView(PAGE_NAMES.CHAIN_EXPE);
                if (!is_legit) { return; }

                this.appendChild(TEMPLATE.content.cloneNode(true));
                /** @type {HTMLElement} */
                this.content = this.querySelector(`#${TAG_IDS.main_page}`);
                /** @type {ChainExperiment} */
                this.current_view = store.state[keys.s_view_objects][store.state[keys.s_current_view_index]];
                /** @type {number | undefined} */
                this.timer_id = undefined;
                this.current_time = 0;
                /** @type {number | undefined} */
                this.time_exceeded_timer = false;

                this._init();
                this._init_events();
            }
          
            disconnectedCallback () {
                if(this.timer_id) {
                    clearInterval(this.timer_id);
                }
            }
        });
    })();
}
catch (err) {
    console.error(err);
}


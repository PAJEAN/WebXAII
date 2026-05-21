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
        more: 'more-btn',
    };

    (function() {
        const PAGE_NAME = PAGE_NAMES.CHAIN_EXPE;

        const TEMPLATE = document.createElement('template');
        TEMPLATE.innerHTML = /* html */`

            <style></style>

            <div id="${TAG_IDS.main_page}" class="vh-100">
                <div class="d-flex flex-column justify-content-center align-items-center h-100 container">
                    <div class="row align-items-stretch">
                        <div class="col d-flex align-items-center flex-column">
                            <div id="${TAG_IDS.image}">
                                <img src="assets/datasets/single-kingfisher-bird_xai.jpg" class="icon rounded img-thumbnail" alt="...">
                            </div>
                            <div class="w-100">
                                <button id="${TAG_IDS.more}" type="button" class="btn btn-primary btn-lg text-uppercase w-100 mt-4">Show me more</button>
                            </div>
                        </div>
                        <div class="col-2 d-flex flex-column justify-content-center align-items-center">
                            <form id="${TAG_IDS.labels_list}" class="d-flex flex-column gap-2 fs-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label1">
                                    <label class="form-check-label" for="label1">Label 1</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label2">
                                    <label class="form-check-label" for="label2">Label 2</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label3">
                                    <label class="form-check-label" for="label3">Label 3</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label4">
                                    <label class="form-check-label" for="label4">Label 4</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label5">
                                    <label class="form-check-label" for="label5">Label 5</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label6">
                                    <label class="form-check-label" for="label6">Label 6</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label7">
                                    <label class="form-check-label" for="label7">Label 7</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="labels" id="label8">
                                    <label class="form-check-label" for="label8">Label 8</label>
                                </div>
                            </form>
                        </div>
                        <div class="col d-flex flex-column align-items-center justify-content-center">
                            <label for="range3" class="form-label fs-2">Confidence of answer : <output for="range4" id="rangeValue" aria-hidden="true">3</output></label>
                            <input type="range" class="form-range" min="0" max="4" step="1" id="range3" list="range-list">

                            <button id="${TAG_IDS.next_btn}" type="button" class="btn btn-primary btn-lg text-uppercase w-100 mt-4">Next</button>

                        </div>
                    </div>
                    <div id="${TAG_IDS.timer}" class="my-4 fs-2"></div>
                    <div id="${TAG_IDS.error}" class="text-center text-danger"></div>
                </div>
            </div>

            <datalist id="range-list">
            <option value="0">
            <option value="1">
            <option value="2">
            <option value="3">
            <option value="4">
            </datalist>

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
                // if (this.current_view.current_image_index >= this.current_view.images.length) { 
                //     this._submit();
                //     return;
                // }

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

                /* Save */
                store.dispatch(keys.a_update_save, {
                    instances: [{
                        answers: form_data.get('labels') == null ? null : parseInt(form_data.get('labels')),
                        time: this.current_time,
                        is_time_exceeded: this.time_exceeded_timer,
                        expected: this.current_view.truth
                    }]
                });           

                this.current_view.current_image_index += 1;

                if (this.current_view.current_image_index >= this.current_view.images.length || (form_data.get('labels') != null && parseInt(form_data.get('labels')) == this.current_view.truth)) {
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
                    return `Timer : ${time} secondes`;
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
                    
                    if (remaining_time <= 5) {
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
                let more_btn = this.content.querySelector(`#${TAG_IDS.more}`);
                more_btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._images();
                });

                // This is an example script, please modify as needed
                const rangeInput = document.getElementById('range3');
                const rangeOutput = document.getElementById('rangeValue');

                // Set initial value
                rangeOutput.textContent = rangeInput.value;

                rangeInput.addEventListener('input', function() {
                    rangeOutput.textContent = this.value;
                });
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

                // this._init();
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


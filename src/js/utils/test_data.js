/* Namespaces */
import { PAGE_NAMES } from 'JS/pages/__namespaces__';

import { Experiment, Form } from "JS/store/modules/view-classes";

export const TEST_VIEW = [
    // {}, // Authentication.
    {
        type: 'page-task',
        desc: 'Exactly 3 squares',
        is_training: true, // opt.
        timer: -1, // opt
        tasks: [
            {
                source: {
                    is_image: true,
                    label: 'assets/datasets/2.jpg'
                },
                model: {
                    is_image: false,
                    label: "Ceci est un texte pour le modèle"
                },
                explanations: [
                    {
                        is_image: true,
                        label: 'assets/datasets/test_lg.png',
                    }
                ],
                expected: 0
            },
            {
                source: {
                    is_image: true,
                    label: 'assets/datasets/2.jpg',
                },
                expected: 0
            }
        ],
        question: {
            type: 'radio',
            primary_text: 'Title',
            secondary_text: 'Voici un sous texte plus long !',
            answers: [
                'choix A',
                'choix B',
            ]
        }
    },
    // {
    //     type: 'page-score'
    // },
    {
        type: 'page-form',
        questions: [
            {
                type: 'radio',
                primary_text: '',
                secondary_text: 'Voici un sous texte plus long !',
                answers: [
                    'choix1',
                    'choix2',
                ]
            },
            {
                type: 'checkbox',
                primary_text: 'Title 2',
                secondary_text: 'Sub title 2',
                answers: [
                    'choix1',
                    'choix2',
                ]
            },
            {
                type: 'radio',
                primary_text: 'Title 3',
                secondary_text: 'Sub title 3',
                answers: [
                    'choix1',
                    'choix2',
                ]
            }
        ]
    },
    {
        type: 'page-form',
        questions: [
            {
                type: 'radio',
                primary_text: '',
                secondary_text: 'Voici un sous texte plus long !',
                answers: [
                    'choix1',
                    'choix2',
                ]
            },
            {
                type: 'checkbox',
                primary_text: 'Title 2',
                secondary_text: 'Sub title 2',
                answers: [
                    'choix1',
                    'choix2',
                ]
            }
        ]
    },
    // {
    //     type: 'page-text',
    //     title: 'Rule',
    //     text: 'Exactly 3 squares',
    //     btn: 'Next'
    // }
];


// TODO: pourquoi quand je passe de la page task à la page form, il y a le component wc-form qui est appelé 2 fois.

export function viewToObject() {
    let views = []
    for (let view of TEST_VIEW) {
        if (!view.hasOwnProperty('type')) {
            return [];
        }
        
        switch (view['type']) {
            case PAGE_NAMES.FORM:
                if (!Form.guard(view)) {
                    console.warn('Form not readable');
                    return [];
                }
                views.push(new Form(view));
                break;
            case PAGE_NAMES.TASK:
                if (!Experiment.guard(view)) {
                    console.warn('Experiment not readable');
                    return [];
                }
                views.push(new Experiment(view));
                break;
        }
    }
    return views;
}

export function testExperimentCompleted() {
    let experiment_completed = [];
    let page_task = TEST_VIEW.filter(it => it['type'] == 'page-task');
    for (let experiment of page_task) {
        experiment_completed.push(new Array(experiment['tasks'].length));
    }
    return experiment_completed;
}

export function testFormCompleted() {
    let form_completed = [];
    let page_form = TEST_VIEW.filter(it => it['type'] == 'page-form');
    for (let _ of page_form) {
        form_completed.push(new Array());
    }
    return form_completed;
}
export const TEST_VIEW = [
    // {}, // Authentication.
    {
        type: 'p-instruction',
        title: 'Rule',
        body_text: 'Exactly 3 squares',
        button_text: 'Next',
        with_button: true,
        countdown: 90 // opt.
    },
    {
        type: 'p-questionnaire',
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
                type: 'slider',
                primary_text: 'Title 3',
                secondary_text: 'Sub title 3',
                answers: ['Slider 1']
            },
            {
                type: 'textfield',
                primary_text: 'Title 4',
                secondary_text: 'Sub title 4',
                answers: ['Text']
            }
        ]
    },
    {
        type: 'p-task',
        title: 'Title task',
        desc: 'Exactly 3 squares',
        show_progression_bar: true, // opt.
        is_training: false, // opt.
        timer: -1, // opt.
        randomize: true,
        feedback_answer_activated: true, // opt.
        feedback_answer_correct: 'You were correct.', // opt.
        feedback_answer_wrong: 'You were wrong.', // opt.
        feedback_answer_show_expected: true, // opt.
        feedback_answer_expected_text: 'Expected answer was: ', // opt.
        instances: [
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/2.jpg',
                    title: 'Source'
                },
                model: {
                    is_image: false,
                    label: "Ceci est un texte pour le modèle",
                    title: 'Model'
                },
                explanations: [
                    {
                        is_image: true,
                        label: 'assets/datasets/test_lg.png',
                        title: 'Explanation'
                    }
                ],
                expected: 0
            },
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/2.jpg',
                    title: 'An other source'
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
    {
        type: 'p-instruction',
        title: 'Rule',
        body_text: 'Exactly 3 squares',
        button_text: 'Next',
        with_button: true,
        score: true
    },
    {
        type: 'p-task',
        desc: 'Exactly 3 squares',
        is_training: false, // opt.
        timer: -1, // opt
        instances: [
            {
                input: {
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
                input: {
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
    {
        type: 'p-instruction',
        title: 'Rule',
        body_text: 'Exactly 3 squares',
        button_text: 'Next',
        with_button: true,
        score: true
    },
    {
        type: 'p-questionnaire',
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
    {
        type: 'p-instruction',
        title: 'Thank',
        with_button: false
    },
];
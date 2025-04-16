export const TEST_VIEW = [
    // {}, // Authentication.
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
        type: 'page-desc',
        title: 'Rule',
        body_text: 'Exactly 3 squares',
        button_text: 'Next',
        with_button: true,
        save: true
    },
    {
        type: 'page-expe',
        desc: 'Exactly 3 squares',
        show_progression_bar: true, // opt
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
    {
        type: 'page-expe',
        desc: 'Exactly 3 squares',
        is_training: false, // opt.
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
    {
        type: 'page-desc',
        title: 'Rule',
        body_text: 'Exactly 3 squares',
        button_text: 'Next',
        with_button: true
    },
    {
        type: 'page-score'
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
    {
        type: 'page-desc',
        title: 'Thank',
        with_button: false
    },
];
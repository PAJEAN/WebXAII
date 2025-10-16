export const TEST_VIEW = [
    // {}, // Authentication.
    {
        view_id: 'my-exp-view',
        type: 'p-task',
        title: '<i>Title task</i>',
        desc: '<b>Description</b>',
        show_progression_bar: true, // opt.
        is_training: false, // opt.
        timer: 200, // opt.
        time_exceeded_timer: 3, // opt.
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
                    label: 'assets/datasets/single-kingfisher-bird.jpg',
                    title: 'Source'
                },
                // model: {
                //     is_image: false,
                //     label: "This is a text for the model",
                //     title: 'Model'
                // },
                // explanations: [
                //     {
                //         is_image: true,
                //         label: 'assets/datasets/single-kingfisher-bird_xai.jpg',
                //         title: 'Explanation'
                //     }
                // ],
                expected: 0
            },
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/single-kingfisher-bird.jpg',
                    title: 'Source'
                },
                model: {
                    is_image: false,
                    label: "This is a text for the model n°2",
                    title: 'Model'
                },
                // explanations: [
                //     {
                //         is_image: true,
                //         label: 'assets/datasets/single-kingfisher-bird_xai.jpg',
                //         title: 'Explanation'
                //     }
                // ],
                expected: 1
            },
        ],
        question: {
            type: 'button',
            primary_text: '<div class="w-100 text-center">Title</div>',
            secondary_text: '<div class="w-100 text-center">Here is a longer text</div>',
            answers: [
                'choix A',
                'choix B',
            ],
            options: {
                css_class_colors: ['btn-success', 'btn-danger']
            }
        }
    },
    {
        view_id: 'my-desc-view',
        score: true,
        type: 'p-instruction',
        title: '<h3><i>Task</i></h3',
        body_text: '<h4>Instruction</h4><p>C\'est du HTML!<img width="500px" src="assets/datasets/single-kingfisher-bird.jpg"></p>',
        button_text: 'Next',
        with_button: true,
        countdown: 260 // opt.
    },
    {
        type: 'p-questionnaire',
        questions: [
            {
                type: 'radio',
                primary_text: '',
                secondary_text: '<i>Here is a longer text</i>',
                answers: [
                    'choix1',
                    '',
                    'choix2',
                ],
                options: {
                    'inline': '',
                    'limit_values': []
                }
            },
            {
                type: 'checkbox',
                primary_text: '<i>Title 2</i>',
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
                answers: [''],
                options: {
                    'limit_values': ['---', '+++'],
                    'step': 10,
                    'display_value': ''
                }
            },
            {
                type: 'textfield',
                primary_text: 'Title 4',
                secondary_text: 'Sub title 4',
                answers: ['']
            }
        ]
    },
    {
        type: 'p-questionnaire',
        questions: [
            {
                type: 'radio',
                primary_text: '',
                secondary_text: 'Here is a longer text',
                answers: [
                    'choix1',
                    'choix2',
                ]
            }
        ]
    },
    {
        type: 'p-questionnaire',
        questions: [
            {
                type: 'radio',
                primary_text: '',
                secondary_text: 'Here is a longer text',
                answers: [
                    'choice1',
                    'choice2',
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
        title: 'Thank you',
        with_button: false
    },
];
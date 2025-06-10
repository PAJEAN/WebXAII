export const TEST_VIEW = [
    // {}, // Authentication.
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
                answers: ['']
            }
        ]
    },
    {
        type: 'p-task',
        title: 'Title task',
        desc: 'Description',
        show_progression_bar: true, // opt.
        is_training: false, // opt.
        timer: 10, // opt.
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
                model: {
                    is_image: false,
                    label: "This is a text for the model",
                    title: 'Model'
                },
                explanations: [
                    {
                        is_image: true,
                        label: 'assets/datasets/single-kingfisher-bird_xai.jpg',
                        title: 'Explanation'
                    }
                ],
                expected: 0
            },
        ],
        question: {
            type: 'radio',
            primary_text: 'Title',
            secondary_text: 'Here is a longer text',
            answers: [
                'choix A',
                'choix B',
            ]
        }
    },
    {
        type: 'p-instruction',
        title: 'Task',
        body_text: 'Instruction',
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
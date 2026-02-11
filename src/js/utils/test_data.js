export const TEST_VIEW = [
    // {}, // Authentication.
    {
        "type": "p-questionnaire",
        "questions": [
            {
                "type": "radio",
                "primary_text": "<h3> Participation to a Study of the impact of AI and explainable AI on Human Performance</h3><br/>",
                "secondary_text": "<header></header><section><b>Project Objectives</b><p>The aim of this project is to study the impact of Artificial Intelligence (AI) and explainable AI on human performance in carrying out a decision-making task.</p></section> <hr> <section><b>What Is Expected of You</b><p>You will need to take decisions related to the content of images of geometrical symbols. For each image presented to you, will have to answer a question within a limited time.</p><p>You are expected to perform as well as possible. <b>Your performance will be evaluated based on the number of correct answers to evaluated tasks, and your bonus remuneration will be calculated based on this performance.</b> You will be informed when a task is evaluated or not.</p></p> Depending on your random assignment into a group, you might receive the assistance of an AI to perform the tasks.</p></section> <hr> <section><b>Your Right to Withdraw from the Study</b><p>You have the right to withdraw from the study at any time.</p></section> <hr> <section><b>Reporting issues</b><p>You can report issues at the email adress given at the end of the study, if you detect any.</p></section> <hr> <section><b>Confidentiality and Privacy</b><p>The information collected in this form is recorded in a file by Jules Leguy for research purposes, specifically to study human performance in a decision making task. The legal basis for this data processing is your consent.</p><p>The collected data will only be shared with the following recipients:</p><ul><li>Jules Leguy</li><li>Andon Tchechmedjiev</li></ul><p>The data will be kept for five years after the scientific publication (expected in 2026). You may request access to your personal data, request corrections, or exercise your right to restrict the processing of your data. </p><p>To exercise your rights or ask questions regarding data processing within this framework, you may contact: <a href='mailto:andon.tchechmedjiev@mines-ales.fr'>andon.tchechmedjiev@mines-ales.fr</a>.</p></section> <hr> <section><b>Expected Benefits of the Study</b><p>Your remuneration will include a <b>fixed part and a variable part.</b></p> <p>The fixed part is a payment at an <b>hourly rate of \u00a36</b>. The expected duration of the experiment is 20 minutes, so it should correspond to a \u00a32.0 payment. The actual time used for this calculation will be the median completion time across all participants.</p> <p>The variable part depends solely on your performance during the experiment. <b>You will receive \u00a30.04 for each correct answer to an evaluated question (not all question will be evaluated, and you will know which ones are evaluated or not). There will be 53 evaluated questions, giving a minimum of \u00a30 and a maximum of \u00a32.12.</b></p><p>In case the measured time is effectively 20 minutes, <b>your remuneration would range from \u00a32.0 to \u00a34.12 depending on your performance</b>. This would correspond to an <b>effective hourly rate ranging between \u00a36 and \u00a312.36</b>.</p></section> <hr> <section><b>Possible Risks</b><p>The risks involved in these tests are no different from those encountered when performing a standard computer task.</p></section> <hr> <section><b>Right to Withdraw Consent</b><p>I understand that my participation in this research is voluntary and that I may refuse to participate. If I choose so, I am free to stop participating at any time, without having to provide justification. I will inform the Scientific Supervisor in writing at the following address: <a href='mailto:jules.leguy@mines-ales.fr'>jules.leguy@mines-ales.fr</a>.</section> <hr> <section><b>Color Vision Requirement</b><p>This study requires accurate color perception, as the tasks involve distinguishing symbols based on color. For this reason, the protocol screens out participants with colorblindness. You have indicated to Prolific that you are not colorblind. Please only accept this form if that is effectively the case.</p></section><section><b>Consent</b></section>",
                "answers": [
                    "I have read and understand the information contained in this document, and I freely and knowingly consent to participate to this research project. I also confirm that I am not colorblind, as I have indicated on my Prolific profile.",
                    "I do not consent to participate to this research project or I am colorblind."
                ]
            }
        ],
        "break": {
            "index": 1,
            "text": "Use the following link to end the experiment and come back to Prolific : <a href='https://app.prolific.com/submissions/complete?cc=C16YLJGE'>https://app.prolific.com/submissions/complete?cc=C16YLJGE</a>. If it doesn't work, use the code C16YLJGE."
        }
    },
    {
        "type": "p-instruction",
        "title": "<h3>Pattern identification tasks</h3>",
        "body_text": "<div class='text-start'> <p> The tasks of this protocol will consist in searching whether a pattern (or its rotations) can be found in an image or not.</p> <p> Below is an example. The pattern to search for contains several symbols, and an empty cell with a question mark. <b>When searching for the pattern, the cell with the question mark can be matched with any symbol </b> (as in the image B), <b>or it can also be matched with an empty cell</b> (as in the image A). In addition, the task consists in searching for rotations of the pattern. The rotations considered are a rotation to the right (symbolized by \u21bb, as in the image C) or a rotation to the left (symbolized by \u21ba, as in the image D). In the image E, the pattern or its rotations do not appear. </p><div class='container-fluid text-center'> <div class='row justify-content-center'> <div class='col-10 col-md-9 d-flex flex-column align-items-center'><img src='assets/res/img/example_patternsearch.png' class='img-fluid' alt='Explanation for the pattern task'> </div> </div> </div> <p> Please read the information above carefully, as you will not be able to return to this page once you click the button below.</p></div>",
        "button_text": "Continue", 
        "with_button": "True"
    },
    {
        "type": "p-instruction",
        "title": "<h3>Let's jump in</h3>",
        "body_text": "<div class='text-start'> <p>You will now perform a first training task. It consists in answering a single question relative to the content of images of symbols of colors. You must answer the question for 4 different images. This task will <b>NOT</b> count towards your bonus remuneration.</p> <p> Please read the information above carefully, as you will not be able to return to this page once you click the button below.</p></div>",
        "button_text": "Continue",
        "with_button": "True"
    },
    {
        view_id: 'my-desc-view',
        score: true,
        type: 'p-instruction',
        title: '<h3><i>Task</i></h3',
        body_text: '<h4>Instruction</h4><p>HTML!</p>',
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
                secondary_text: 'Here is a longer text',
                answers: [
                    'choix1',
                    'choix2',
                ]
            }
        ],
        break: {
            index: 1,
            text: 'Thank you for you participation, bye.'
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
        view_id: 'my-exp-view',
        type: 'p-task',
        title: '<i>Title task</i>',
        desc: '<b>Description</b>',
        show_progression_bar: true, // opt.
        is_training: false, // opt.
        timer: -1, // opt.
        time_exceeded_timer: 3, // opt.
        randomize: false,
        feedback_answer_activated: false, // opt.
        feedback_answer_correct: 'You were correct.', // opt.
        feedback_answer_wrong: 'You were wrong.', // opt.
        feedback_answer_show_expected: true, // opt.
        feedback_answer_expected_text: 'Expected answer was: ', // opt.
        instances: [
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/1.png',
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
                //         label: 'assets/datasets/2.png',
                //         title: 'Explanation'
                //     }
                // ],
                expected: 0
            },
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/1.png',
                    title: 'Source'
                },
                // model: {
                //     is_image: false,
                //     label: "This is a text for the model n°2",
                //     title: 'Model'
                // },
                explanations: [
                    {
                        is_image: true,
                        label: 'assets/datasets/2.png',
                        title: 'Explanation'
                    }
                ],
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
        view_id: 'my-exp-view',
        type: 'p-task',
        title: '<i>Title task</i>',
        desc: '<b>Description</b>',
        show_progression_bar: true, // opt.
        is_training: false, // opt.
        timer: 5, // opt.
        time_exceeded_timer: 3, // opt.
        randomize: false,
        feedback_answer_activated: true, // opt.
        feedback_answer_correct: 'You were correct.', // opt.
        feedback_answer_wrong: 'You were wrong.', // opt.
        feedback_answer_show_expected: true, // opt.
        feedback_answer_expected_text: 'Expected answer was: ', // opt.
        instances: [
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/1.png',
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
                //         label: 'assets/datasets/2.png',
                //         title: 'Explanation'
                //     }
                // ],
                expected: 0
            },
            {
                input: {
                    is_image: true,
                    label: 'assets/datasets/1.png',
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
                //         label: 'assets/datasets/2.png',
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
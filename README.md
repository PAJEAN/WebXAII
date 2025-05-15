# WebXAll

## 🛠️ Installation & Setup

### Prerequisites

Before getting started, make sure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (version **18.0.0** or higher recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)

---

### Clone the Repository

```bash
git clone https://github.com/PAJEAN/WebXAII.git
cd WebXAII
```

### Install Dependencies

Once inside the project folder, run the following command to install all dependencies:

```bash
npm install
```

---

### 📦 Build for Production

To generate the production build of the project, run:

```bash
npm run build
```

This command uses Webpack to bundle and optimize the frontend application. The output will be placed in the [`dist`](./dist) folder.

You can then serve the contents of the `dist` folder.

---

### 🖥️ Start the Backend Server

If you want to test the application with a real backend, you can start the backend server with:

```bash
npm run dev-back
# Or with nodemon: ./node_modules/nodemon/bin/nodemon.js functions/index.js
```

Make sure the `MAIN_URL` variable in [`src/utils/test_data.js`](src/utils/test_data.js) points to the correct backend address (e.g., `http://localhost:3000`) so that API calls are routed properly.

---

### 🚀 Optional : Start the Development Environment (Frontend Only)

To start the frontend development server with hot-reloading (handled by Webpack), run:

```bash
npm run dev-front
```

During development, the frontend uses mock data provided in [`src/utils/test_data.js`](src/utils/test_data.js).

> **Note:** This file simulates API responses and is useful when the backend is not running.

---


## 🧩 Customizing Server content

To use your own data with the application, you need to modify the content of the `data/` directory located in the backend.

The structure is as follows:

```
functions/
└── data/
    ├── protocols/
    │   └── p1-test.json          # Protocol file
    ├── user-data/                # Directory in which user results will be stored
    └── users.json                # User configuration file (connection module)
```

### 👤 Connection module

All users are defined in the [`users.json`](functions/data/users.json) file.

Example:

```json
{
    "user1": {
        "roles": "user",
        "protocol": "p1-test.json"
    },
    "user2": {
        "roles": "user",
        "protocol": "p2-test.json"
    },
    "user3": {
        "roles": "user",
        "protocol": "p2-test.json"
    }
}
```

* `"user1"`, `"user2"` and `"user3"` are the **user IDs**.
* `"roles"` defines the role (currently unused but reserved for permission levels).
* `"protocol"` refers to a file in the `protocols/` folder, which describes the expected experiment for that user.

> ℹ️ You can assign the same protocol file to multiple users.

> ⚠️ Make sure that each protocol filename in `users.json` matches an actual file in the `protocols/` folder.

---
## 📋 Implementing a protocol

A protocol file (in `protocols/`) is a JSON file which defines all the content for a given protocol. It is defined as
a list of views, and each view is defined as an object (or dictionary).

```json
   [
      {
        "type":  "p-instruction",
        [...]
      },
      {
        "type":  "p-questionnaire",
        [...]
      },
      {
        "type":  "p-task",
        [...]
      }
   ]
```
The views can be configured as follows.

### Instruction view

An instruction view is obtained by using the type ```"type": "p-instruction"```.
It supports the following configuration attributes (besides ```"type"```).
* "title" : Title displayed in bold (text).
* "body_text" : Text content (text).
* "button_text" : Text content of the button (text).
* "with_button" : Whether to display a button allowing to go to the next view or not (boolean).
* "countdown" : @TODO

Example :

```json
{
  "type": "p-instruction",
  "title": "Training task (1/2)",
  "body_text": "During this experiment, you will have to solve mazes with the help of an AI. You will first perform a training phase so that you get comfortable with the interface and the problem. As a first training task, you will have to solve a series of mazes by yourself, without any AI assistance. Throughout the training series, you will get a feedback each time you answer, so that you know if you took the right decision or not. Are you ready to do the first training series ?",
  "button_text": "Start the first training series",
  "with_button": true
}
```
![](reproduction_Vasconcelos2023/data/screenshots/instructions_example.png)

### Questionnaire view

A questionnaire view is obtained by using the type ```"type": "p-questionnaire"```. It is defined by the following 
structure of attributes (besides ```"type"```).
* ```"questions"``` : list of question objects, which are each defined by a dictionary containing the following attributes:
  * ```"type"``` : defines the type of the question (either ```"radio"``` for exclusive choices, ```"checkbox"``` for non-exclusive
  choices, ```"textfield"``` for an open text answer and ```"slider"``` for a slider input).
  * ```"answers"``` : list of possible answers if applicable (list of text strings).
  * ```"primary_text"``` : Title of the question to be written in bold above the choices (text, optional).
  * ```"secondary_text"``` : Additional text for the question to be written in smaller characters (text, optional).

Example :

![](reproduction_Vasconcelos2023/data/screenshots/quest_example.png)

```json
{
  "type": "p-questionnaire",
  "questions": [
    {
      "type": "radio",
      "primary_text": "Please complete the following survey about the AI that assisted you.",
      "secondary_text": "I believe the AI is a competent performer.",
      "answers": [
        "Strongly disagree",
        "Disagree",
        "Somewhat disagree",
        "Neither agree nor disagree",
        "Somewhat agree",
        "Agree",
        "Strongly agree"
      ]
    },
    [...]
    {
      "type": "slider",
      "primary_text": "",
      "secondary_text": "Approximately, how accurate do you think the AI is? Please indicate using the slider below (from 0% to 100%).",
      "answers": [
        ""
      ]
    },
    [...]
    {
      "type": "textfield",
      "primary_text": "",
      "secondary_text": "In the box below, please describe how you chose between using the AI and doing the task yourself.",
      "answers": [
        ""
      ]
    }
  ]
}
```
### Task view

A task view is obtained by using the type ```"type": "p-task"```. Each task is defined by an object (or dictionary) 
containing the following attributes (besides ```"type"```).
* ```"title"``` : Title of the task (text, optional).
* ```"desc"``` : Text description of the task to be displayed below the title (text, optional). 
* ```"question"``` : Question and possible answers which are submitted to the user for every instance of the task. It is defined by a dictionary which accepts the same attributes as the question dictionary in the questionnaire view. However, it only supports the types ```"radio"``` and ```"checkbox"``` in this context.
* ```"show_progression_bar"``` : Whether to show the progression bar on the view (default: **false**, optional, boolean).
* ```"randomize"``` : Whether to randomize the order used to display the instances to the user (default: **false**, optional, boolean).
* ```"timer"``` : If not -1, defines a time limit in seconds for the user to give an answer to the instance. If the time is expired, the view goes to the next instance. If defined, the timer is shown on the view (default : **-1**, positive integer).
* ```"feedback_answer_activated"``` : Whether to show a feedback on the correctness of the answer (default: **false**, optional, boolean).
* ```"feedback_answer_correct"``` : Text to show to the user when they are correct (text, optional).
* ```"feedback_answer_wrong"``` : Text to show to the user when they are wrong (text, optional).
* ```"feedback_answer_show_expected"``` : Whether the expected answer is indicated to the user as part of the feedback (default: **false**, optional, boolean).
* ```"feedback_answer_expected_text"``` : Text to introduce the expected answer to the user (text, optional).
* ```"instances"``` : list of objects which describe all the instances of the task. Each instance is described by a dictionary with the following attributes:
  * ```"input"``` : Dictionary describing the input and containing the following attributes:
    * ```"is_image"``` : Whether the input is an image (boolean)
    * ```"label"``` : Text description of the input, or path to the image (text).
    * ```"title"``` : Title to be displayed below the input (text, optional).
  * ```"model"``` : Dictionary describing the model prediction and containing the same attributes as for ```"input"```.
  * ```"explanations"``` :  List of dictionaries describing each explanation. Each of them is described by a dictionary containing the same attributes as for ```"input"```.
  * ```"expected"``` : Index of the expected answer, if applicable (positive integer, optional).

Example : 

![](reproduction_Vasconcelos2023/data/screenshots/decision_example.png)

```json
{
  "type": "p-task",
  "title": "",
  "desc": "",
  "show_progression_bar": false,
  "randomize": true,
  "timer": -1,
  "feedback_answer_activated": true,
  "feedback_answer_correct": "This was the right answer",
  "feedback_answer_wrong": "This was not the right answer",
  "instances": [
    {
      "model": {
        "is_image": false,
        "label": "AI's suggestion : B",
        "title": ""
      },
      "explanations": [
        {
          "is_image": true,
          "label": "assets/vasconcelos2023/mediummaze_sol.png",
          "title": ""
        }
      ],
      "expected": 1
    }
  ],
  "question": {
    "type": "radio",
    "primary_text": "",
    "secondary_text": "Which exit can you get to from the start ?",
    "answers": [
      "A",
      "B",
      "C",
      "D"
    ]
  }
}
```
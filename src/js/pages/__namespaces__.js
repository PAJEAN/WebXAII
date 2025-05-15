// @ts-check

import { Desc, Experiment, Form } from "JS/store/modules/view-classes";

export const PAGE_NAMES = {
    AUTHENTICATION: 'p-authentication',
    DESC:           'p-instruction',
    EXPE:           'p-task',
    FORM:           'p-questionnaire',
}

export const PAGES_INFO = {
    [PAGE_NAMES.AUTHENTICATION]: {
        route: {
            path: '/',
            title: 'Authentication',
            is_default: true
        },
    },
    [PAGE_NAMES.DESC]: {
        route: {
            path: '/desc',
            title: 'Instruction'
        },
        class_type: Desc
    },
    [PAGE_NAMES.EXPE]: {
        route: {
            path: '/expe',
            title: 'Task'
        },
        class_type: Experiment
    },
    [PAGE_NAMES.FORM]: {
        route: {
            path: '/form',
            title: 'Questionnaire'
        },
        class_type: Form
    }
}
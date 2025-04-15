// @ts-check

import { Desc, Experiment, Form } from "JS/store/modules/view-classes";

export const PAGE_NAMES = {
    AUTHENTICATION: 'page-authentication',
    DESC:           'page-desc',
    EXPE:           'page-expe',
    FORM:           'page-form',
    SCORE:          'page-score',
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
            title: 'Description'
        },
        class_type: Desc
    },
    [PAGE_NAMES.EXPE]: {
        route: {
            path: '/expe',
            title: 'Experiment'
        },
        class_type: Experiment
    },
    [PAGE_NAMES.FORM]: {
        route: {
            path: '/form',
            title: 'Form'
        },
        class_type: Form
    },
    [PAGE_NAMES.SCORE]: {
        route: {
            path: '/score',
            title: 'Score'
        }
    },
}
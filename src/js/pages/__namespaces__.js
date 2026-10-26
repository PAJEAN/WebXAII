// @ts-check

import { Desc, ChainExperiment, Experiment, Form, SingleExperiment, ChainExperimentDiscr, DescDiscr} from "JS/store/modules/view-classes";

export const PAGE_NAMES = {
    AUTHENTICATION: 'p-authentication',
    DESC:           'p-instruction',
    EXPE:           'p-task',
    CHAIN_EXPE:     'p-chain-task',
    FORM:           'p-questionnaire',
    SINGLE_EXPE:    'p-single-task',
    CHAIN_EXPE_DISCR:    'p-chain-exp-discr',
    DESC_DISCR: 'p-desc-discr'
}

export const PAGES_INFO = {
    [PAGE_NAMES.AUTHENTICATION]: {
        route: {
            path: '/auth/:user-id',
            title: 'Authentication',
            is_default: true
        }
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
    [PAGE_NAMES.CHAIN_EXPE]: {
        route: {
            path: '/chain-expe',
            title: 'Chain experiment'
        },
        class_type: ChainExperiment
    },
    [PAGE_NAMES.FORM]: {
        route: {
            path: '/form',
            title: 'Questionnaire'
        },
        class_type: Form
    },
    [PAGE_NAMES.SINGLE_EXPE]: {
        route: {
            path: '/single-expe',
            title: 'Single experiment'
        },
        class_type: SingleExperiment
    },
    [PAGE_NAMES.CHAIN_EXPE_DISCR]: {
        route: {
            path: '/chain-expe-discr',
            title: 'Chain experiment'
        },
        class_type: ChainExperimentDiscr
    },
    [PAGE_NAMES.DESC_DISCR]: {
        route: {
            path: '/desc-discrete',
            title: 'Instruction'
        },
        class_type: DescDiscr
    },
}
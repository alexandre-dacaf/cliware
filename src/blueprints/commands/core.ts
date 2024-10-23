import { Blueprint } from '../../types';
import { changeTerminalColumns, createTerminal, deleteTerminal } from '../actions';

export const coreCommands: Blueprint = {
    cols: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: changeTerminalColumns,
                next: 'result',
            },
            result: {
                type: 'output',
                outputFunction: () => {
                    return "Emitted event 'changeTerminalColumns'.";
                },
            },
        },
    },
    nt: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: createTerminal,
                next: 'result',
            },
            result: {
                type: 'output',
                outputFunction: () => {
                    return "Emitted event 'createTerminal'.";
                },
            },
        },
    },
    dt: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: deleteTerminal,
                next: 'result',
            },
            result: {
                type: 'output',
                outputFunction: () => {
                    return "Emitted event 'deleteTerminal'.";
                },
            },
        },
    },
};

import { Blueprint } from 'types';
import { changeTerminalColumns, createTerminal, deleteTerminal } from './coreActions';

export const coreCommands: Blueprint.Blueprint = {
    cols: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: changeTerminalColumns,
            },
        },
    },
    nt: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: createTerminal,
            },
        },
    },
    dt: {
        entrypoint: 'action',
        pipeline: {
            action: {
                type: 'action',
                actionFunction: deleteTerminal,
            },
        },
    },
};

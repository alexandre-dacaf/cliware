import { Blueprint, TaskStream } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './commands/core';

export const blueprint: Blueprint = {
    ...coreCommands,
    todo: {
        entrypoint: 'q1',
        pipeline: {
            q1: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite1:',
                min: 4,
                float: true,
                next: 'q2',
            },
            q2: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite2:',
                min: 2,
                next: 'act',
            },
            act: {
                type: 'action',
                actionFunction: createTodo,
            },
        },
    },
};

import { Blueprint, PipelineData } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './commands/core';

export const blueprint: Blueprint = {
    ...coreCommands,
    todo: {
        entrypoint: 'q1',
        pipeline: {
            q1: {
                type: 'prompt',
                promptType: 'text',
                message: 'Digite:',
                next: 'q2',
            },
            q2: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite:',
                next: 'result',
            },
            result: {
                type: 'output',
                outputFunction: (pipelineData: PipelineData) => {
                    return `Tarefa ${JSON.stringify(pipelineData.$responses)} criada com sucesso!`;
                },
            },
        },
    },
};

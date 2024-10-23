import { CommandConfig, PipelineData } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './coreCommands';

export const commandConfig: CommandConfig = {
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
                    return `Tarefa ${JSON.stringify(pipelineData.$pipeline)} criada com sucesso!`;
                },
            },
        },
    },
};

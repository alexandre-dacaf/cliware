import { CommandConfig, TaskKey, PipelineData } from '../types';
import { createTodo } from './actions';
import { coreCommands } from './coreCommands';

export const commandConfig: CommandConfig = {
    ...coreCommands,
    todo: {
        entrypoint: 'number',
        pipeline: {
            number: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite um número:',
                next: 'number1',
            },
            number1: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite um número:',
                next: 'result',
            },
            result: {
                type: 'output',
                outputFunction: (pipelineData: PipelineData) => {
                    return `Tarefa '${JSON.stringify(pipelineData.$pipeline)}' criada com sucesso!`;
                },
            },
        },
    },
};

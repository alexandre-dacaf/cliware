import { Blueprint } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './commands/core';

export const blueprint: Blueprint = {
    ...coreCommands,
    todo: {
        entrypoint: 'q1',
        pipeline: {
            q1: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite1:',
                choices: [
                    { value: 'dog', label: 'Cachorro' },
                    { value: 'cat', label: 'Gato' },
                    { value: 'rabbit', label: 'Coelho' },
                    { value: 'hamster', label: 'Hamster' },
                    { value: 'parrot', label: 'Papagaio' },
                    { value: 'turtle', label: 'Tartaruga' },
                    { value: 'goldfish', label: 'Peixe Dourado' },
                    { value: 'snake', label: 'Cobra' },
                    { value: 'lizard', label: 'Lagarto' },
                    { value: 'frog', label: 'Sapo' },
                    { value: 'ferret', label: 'Furão' },
                    { value: 'horse', label: 'Cavalo' },
                    { value: 'sheep', label: 'Ovelha' },
                    { value: 'goat', label: 'Cabra' },
                    { value: 'cow', label: 'Vaca' },
                    { value: 'pig', label: 'Porco' },
                    { value: 'chicken', label: 'Galinha' },
                    { value: 'duck', label: 'Pato' },
                    { value: 'fox', label: 'Raposa' },
                    { value: 'wolf', label: 'Lobo' },
                    { value: 'bear', label: 'Urso' },
                    { value: 'elephant', label: 'Elefante' },
                    { value: 'giraffe', label: 'Girafa' },
                    { value: 'lion', label: 'Leão' },
                    { value: 'tiger', label: 'Tigre' },
                    { value: 'zebra', label: 'Zebra' },
                    { value: 'kangaroo', label: 'Canguru' },
                    { value: 'penguin', label: 'Pinguim' },
                    { value: 'whale', label: 'Baleia' },
                    { value: 'dolphin', label: 'Golfinho' },
                    { value: 'eagle', label: 'Águia' },
                    { value: 'owl', label: 'Coruja' },
                ],
                next: 'q2',
            },
            q2: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite2:',
                next: 'act',
            },
            act: {
                type: 'action',
                actionFunction: createTodo,
            },
        },
    },
};

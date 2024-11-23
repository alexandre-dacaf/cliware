import { Blueprint } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './core/coreCommands';

export const blueprint: Blueprint = {
    ...coreCommands,
    todo: {
        entrypoint: 'q1',
        pipeline: {
            // Texto
            // q1: {
            //     type: 'prompt',
            //     promptType: 'text',
            //     message: 'Digite um texto:',
            //     next: 'act',
            //     default: 'teste 123',
            // },

            // Toggle
            // q1: {
            //     type: 'prompt',
            //     promptType: 'toggle',
            //     message: 'Ativar ou desativar? ',
            //     trueLabel: 'Sim',
            //     falseLabel: 'Não',
            //     next: 'q2',
            //     default: true,
            // },
            // q2: {
            //     type: 'prompt',
            //     promptType: 'toggle',
            //     message: 'Ativar ou desativar? ',
            //     trueLabel: 'Sim',
            //     falseLabel: 'Não',
            //     next: 'act',
            //     default: true,
            // },

            // Select - Animais
            // q1: {
            //     type: 'prompt',
            //     promptType: 'select',
            //     message: 'Selecione um animal:',
            //     choices: [
            //         { label: 'Leão', value: 'lion' },
            //         { label: 'Elefante', value: 'elephant' },
            //         { label: 'Tigre', value: 'tiger' },
            //         { label: 'Girafa', value: 'giraffe' },
            //         { label: 'Zebra', value: 'zebra' },
            //         { label: 'Canguru', value: 'kangaroo' },
            //         { label: 'Panda', value: 'panda' },
            //         { label: 'Rinoceronte', value: 'rhinoceros' },
            //         { label: 'Hipopótamo', value: 'hippopotamus' },
            //         { label: 'Gorila', value: 'gorilla' },
            //         { label: 'Cobra', value: 'cobra' },
            //         { label: 'Águia', value: 'eagle' },
            //         { label: 'Lobo', value: 'wolf' },
            //         { label: 'Urso Polar', value: 'polar_bear' },
            //         { label: 'Falcão', value: 'falcon' },
            //     ],
            //     default: 'panda',
            //     next: 'act',
            // },

            // Multiselect - Comidas
            // q1: {
            //     type: 'prompt',
            //     promptType: 'multiselect',
            //     message: 'Selecione suas comidas favoritas:',
            //     choices: [
            //         { label: 'Pizza', value: 'pizza' },
            //         { label: 'Sushi', value: 'sushi' },
            //         { label: 'Hambúrguer', value: 'hamburger' },
            //         { label: 'Salada', value: 'salad' },
            //         { label: 'Tacos', value: 'tacos' },
            //         { label: 'Pasta', value: 'pasta' },
            //         { label: 'Churrasco', value: 'barbecue' },
            //         { label: 'Sorvete', value: 'ice_cream' },
            //         { label: 'Curry', value: 'curry' },
            //         { label: 'Burrito', value: 'burrito' },
            //         { label: 'Steak', value: 'steak' },
            //         { label: 'Paella', value: 'paella' },
            //         { label: 'Falafel', value: 'falafel' },
            //         { label: 'Ramen', value: 'ramen' },
            //         { label: 'Dim Sum', value: 'dim_sum' },
            //     ],
            //     default: 'ice_cream',
            //     next: 'act',
            // },

            // Número
            // q1: {
            //     type: 'prompt',
            //     promptType: 'number',
            //     message: 'Digite um número:',
            //     min: 10,
            //     max: 100,
            //     float: true,
            //     decimals: 3,
            //     step: 1,
            //     default: 14,
            //     next: 'q2',
            // },
            // q2: {
            //     type: 'prompt',
            //     promptType: 'number',
            //     message: 'Digite um número:',
            //     min: -2,
            //     max: 10,
            //     step: 2,
            //     default: 6,
            //     next: 'act',
            // },

            // Lista
            // q1: {
            //     type: 'prompt',
            //     promptType: 'list',
            //     message: 'Digite valores separados por vírgulas:',
            //     separator: ',',
            //     next: 'act',
            // },

            // Data
            // q1: {
            //     type: 'prompt',
            //     promptType: 'date',
            //     message: 'Selecione uma data:',
            //     default: '01/11/2024',
            //     next: 'q2',
            // },
            // q2: {
            //     type: 'prompt',
            //     promptType: 'date',
            //     message: 'Selecione uma data:',
            //     default: '03/07/2029',
            //     next: 'act',
            // },

            // Autocomplete - Países
            q1: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite para buscar um país:',
                suggestions: [
                    'Brasil',
                    'Canadá',
                    'Estados Unidos',
                    'França',
                    'Alemanha',
                    'Japão',
                    'China',
                    'Índia',
                    'Austrália',
                    'Itália',
                    'Espanha',
                    'México',
                    'Rússia',
                    'Reino Unido',
                    'Argentina',
                ],
                default: 'Rússia',
                itemsPerPage: 5,
                next: 'q2',
            },
            q2: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite para buscar um país:',
                suggestions: [
                    'Brasil',
                    'Canadá',
                    'Estados Unidos',
                    'França',
                    'Alemanha',
                    'Japão',
                    'China',
                    'Índia',
                    'Austrália',
                    'Itália',
                    'Espanha',
                    'México',
                    'Rússia',
                    'Reino Unido',
                    'Argentina',
                ],
                default: 'Japão',
                itemsPerPage: 5,
                next: 'act',
            },

            // Senha
            // q1: {
            //     type: 'prompt',
            //     promptType: 'password',
            //     message: 'Digite uma senha:',
            //     next: 'act',
            // },

            act: {
                type: 'action',
                actionFunction: createTodo,
                next: 'result',
            },
            result: {
                type: 'action',
                actionFunction: (context) => {
                    context.printer.printOutput(
                        `Respostas: ${JSON.stringify(context.pipelineData)}`
                    );
                },
            },
        },
    },
};

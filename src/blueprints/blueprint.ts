import { Blueprint } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './core/coreCommands';

export const blueprint: Blueprint = {
    // ...coreCommands,
    todo: {
        entrypoint: 'selectPromptType',
        pipeline: {
            // Etapa inicial para selecionar o tipo de prompt
            selectPromptType: {
                type: 'prompt',
                promptType: 'select',
                message: 'Selecione o tipo de prompt que deseja utilizar:',
                choices: [
                    { label: 'Texto', value: 'text' },
                    { label: 'Toggle', value: 'toggle' },
                    { label: 'Select', value: 'select' },
                    { label: 'Multiselect', value: 'multiselect' },
                    { label: 'Número', value: 'number' },
                    { label: 'Lista', value: 'list' },
                    { label: 'Data', value: 'date' },
                    { label: 'Autocomplete', value: 'autocomplete' },
                    { label: 'Senha', value: 'password' },
                ],
                default: 'text',
                next: (context) => {
                    const selectedType = context.pipelineData.selectPromptType.value;
                    return `${selectedType}_q1`;
                },
            },

            // --- Texto ---
            text_q1: {
                type: 'prompt',
                promptType: 'text',
                message: 'Digite um texto (Q1):',
                placeholder: 'Placeholder...',
                required: true,
                trim: true,
                next: 'text_q2',
            },
            text_q2: {
                type: 'prompt',
                promptType: 'text',
                message: 'Digite outro texto (Q2):',
                default: 'teste 456',
                next: 'act',
            },

            // --- Toggle ---
            toggle_q1: {
                type: 'prompt',
                promptType: 'toggle',
                message: 'Ativar ou desativar? (Q1)',
                trueLabel: 'Sim',
                falseLabel: 'Não',
                default: true,
                next: 'toggle_q2',
            },
            toggle_q2: {
                type: 'prompt',
                promptType: 'toggle',
                message: 'Confirmar ativação? (Q2)',
                trueLabel: 'Sim',
                falseLabel: 'Não',
                default: false,
                next: 'act',
            },

            // --- Select ---
            select_q1: {
                type: 'prompt',
                promptType: 'select',
                message: 'Selecione um animal (Q1):',
                choices: [
                    { label: 'Leão', value: 'lion', hint: 'Rei da selva' },
                    { label: 'Elefante', value: 'elephant' },
                    { label: 'Tigre', value: 'tiger' },
                    { label: 'Girafa', value: 'giraffe' },
                    { label: 'Zebra', value: 'zebra' },
                    { label: 'Canguru', value: 'kangaroo' },
                    { label: 'Panda', value: 'panda' },
                    { label: 'Rinoceronte', value: 'rhinoceros' },
                    { label: 'Hipopótamo', value: 'hippopotamus' },
                    { label: 'Gorila', value: 'gorilla' },
                    { label: 'Cobra', value: 'cobra' },
                    { label: 'Águia', value: 'eagle' },
                    { label: 'Lobo', value: 'wolf', hint: 'Auuuuuu' },
                    { label: 'Urso Polar', value: 'polar_bear' },
                    { label: 'Falcão', value: 'falcon' },
                ],
                default: 'zebra',
                next: 'select_q2',
            },
            select_q2: {
                type: 'prompt',
                promptType: 'select',
                message: 'Selecione outro animal (Q2):',
                choices: [
                    { label: 'Leão', value: 'lion' },
                    { label: 'Elefante', value: 'elephant' },
                    { label: 'Tigre', value: 'tiger' },
                    { label: 'Girafa', value: 'giraffe' },
                    { label: 'Zebra', value: 'zebra' },
                    { label: 'Canguru', value: 'kangaroo' },
                    { label: 'Panda', value: 'panda' },
                    { label: 'Rinoceronte', value: 'rhinoceros' },
                    { label: 'Hipopótamo', value: 'hippopotamus' },
                    { label: 'Gorila', value: 'gorilla' },
                    { label: 'Cobra', value: 'cobra' },
                    { label: 'Águia', value: 'eagle' },
                    { label: 'Lobo', value: 'wolf' },
                    { label: 'Urso Polar', value: 'polar_bear' },
                    { label: 'Falcão', value: 'falcon' },
                ],
                default: 'wolf',
                validate: (response) => {
                    if (response.value.startsWith('w')) {
                        return "Select something that doesn't start with a 'w'";
                    }

                    return true;
                },
                next: 'act',
            },

            // --- Multiselect ---
            multiselect_q1: {
                type: 'prompt',
                promptType: 'multiselect',
                message: 'Selecione suas comidas favoritas (Q1):',
                choices: [
                    { label: 'Pizza', value: 'pizza' },
                    { label: 'Sushi', value: 'sushi' },
                    { label: 'Hambúrguer', value: 'hamburger' },
                    { label: 'Salada', value: 'salad' },
                    { label: 'Tacos', value: 'tacos', hint: '😋' },
                    { label: 'Pasta', value: 'pasta' },
                    { label: 'Churrasco', value: 'barbecue' },
                    { label: 'Sorvete', value: 'ice_cream' },
                    { label: 'Curry', value: 'curry' },
                    { label: 'Burrito', value: 'burrito', hint: "Let's bora" },
                    { label: 'Steak', value: 'steak' },
                    { label: 'Paella', value: 'paella' },
                    { label: 'Falafel', value: 'falafel' },
                    { label: 'Ramen', value: 'ramen', hint: 'The best!' },
                    { label: 'Dim Sum', value: 'dim_sum' },
                ],
                default: 'pizza',
                validate: (response) => {
                    if (response.length < 3) {
                        return 'Select at least 3';
                    }

                    return true;
                },
                required: true,
                next: 'multiselect_q2',
            },
            multiselect_q2: {
                type: 'prompt',
                promptType: 'multiselect',
                message: 'Selecione mais comidas favoritas (Q2):',
                choices: [
                    { label: 'Pizza', value: 'pizza' },
                    { label: 'Sushi', value: 'sushi' },
                    { label: 'Hambúrguer', value: 'hamburger' },
                    { label: 'Salada', value: 'salad' },
                    { label: 'Tacos', value: 'tacos' },
                    { label: 'Pasta', value: 'pasta' },
                    { label: 'Churrasco', value: 'barbecue' },
                    { label: 'Sorvete', value: 'ice_cream' },
                    { label: 'Curry', value: 'curry' },
                    { label: 'Burrito', value: 'burrito' },
                    { label: 'Steak', value: 'steak' },
                    { label: 'Paella', value: 'paella' },
                    { label: 'Falafel', value: 'falafel' },
                    { label: 'Ramen', value: 'ramen' },
                    { label: 'Dim Sum', value: 'dim_sum' },
                ],
                default: 'salad',
                required: true,
                next: 'act',
            },

            // --- Número ---
            number_q1: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite um número (Q1):',
                min: 10,
                max: 100,
                float: true,
                decimals: 3,
                step: 1,
                default: 14,
                required: true,
                validate: (response) => {
                    if (response % 2 === 1) {
                        return 'Insert even number';
                    }

                    return true;
                },
                placeholder: 'Digite...',
                next: 'number_q2',
            },
            number_q2: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite outro número (Q2):',
                min: -2,
                max: 10,
                step: 2,
                default: 6,
                next: 'act',
            },

            // --- Lista ---
            list_q1: {
                type: 'prompt',
                promptType: 'list',
                message: 'Digite valores separados por vírgulas (Q1):',
                trim: true,
                required: true,
                placeholder: 'Digite...',
                validate: (response) => {
                    if (response.length < 3) {
                        return 'Insert at lest 3.';
                    }

                    return true;
                },
                next: 'list_q2',
            },
            list_q2: {
                type: 'prompt',
                promptType: 'list',
                message: 'Digite mais valores separados por vírgulas (Q2):',
                separator: '/',
                trim: false,
                next: 'act',
            },

            // --- Data ---
            date_q1: {
                type: 'prompt',
                promptType: 'date',
                message: 'Selecione uma data (Q1):',
                default: '01/11/2024',
                required: true,
                placeholder: 'Digite...',
                validate: (response) => {
                    const today = new Date();
                    const inputDate = new Date(response);
                    if (inputDate < today) {
                        return 'Date cannot be in the past. Please choose a future date.';
                    }
                    return true;
                },
                next: 'date_q2',
            },
            date_q2: {
                type: 'prompt',
                promptType: 'date',
                message: 'Selecione outra data (Q2):',
                default: '03/07/2029',
                next: 'act',
            },

            // --- Autocomplete ---
            autocomplete_q1: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite para buscar um país (Q1):',
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
                required: true,
                validate: (response) => {
                    if (response.startsWith('a')) {
                        return "Can't start with a";
                    }
                    return true;
                },
                placeholder: 'Digite...',
                next: 'autocomplete_q2',
            },
            autocomplete_q2: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite para buscar outro país (Q2):',
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

            // --- Senha ---
            password_q1: {
                type: 'prompt',
                promptType: 'password',
                message: 'Digite uma senha (Q1):',
                required: true,
                validate: (response) => {
                    if (response.length < 8) {
                        return 'At least 8 chars';
                    }
                    return true;
                },
                placeholder: 'Digite...',
                next: 'password_q2',
            },
            password_q2: {
                type: 'prompt',
                promptType: 'password',
                message: 'Confirme sua senha (Q2):',
                required: false,
                next: 'act',
            },

            // --- Ação Final ---
            act: {
                type: 'action',
                actionFunction: createTodo,
                next: 'result',
            },
            result: {
                type: 'action',
                actionFunction: (context) => {
                    context.printer.printJson(JSON.stringify(context.pipelineData, null, 2));
                },
            },
        },
    },
};

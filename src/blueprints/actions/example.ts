import { Action, Pipeline, Prompt } from 'types';

export const createTodo: Action.ActionFunction = async (
    context: Pipeline.Context
): Promise<any> => {
    context.hooks.messagePanel.setMessageText([
        { color: 'yellow', spinner: { name: 'dots3' } },
        { color: 'yellow', text: ' Executando' },
        { color: 'yellow', spinner: { name: 'ellipsis', interval: 400 } },
    ]);

    context.hooks.messagePanel.setProgressBarStyle({
        color: 'yellow',
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    context.hooks.messagePanel.updateProgressBarPercentage(40);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.hooks.messagePanel.updateProgressBarPercentage(100);
    await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const getChoices: Prompt.ChoiceFunction = async (context: Pipeline.Context) => {
    context.hooks.messagePanel.setMessageText([
        { color: 'yellow', spinner: { name: 'dots3' } },
        { color: 'yellow', text: ' Executando' },
        { color: 'yellow', spinner: { name: 'ellipsis', interval: 400 } },
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    context.hooks.messagePanel.clearDisplay();

    const choices = [
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
    ];

    return choices;
};

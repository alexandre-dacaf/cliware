import { Action, Pipeline } from 'types';

export const createTodo: Action.ActionFunction = async (
    context: Pipeline.Context
): Promise<any> => {
    context.messagePanel.setMessageText([
        { color: 'blue', spinner: { name: 'dots3' } },
        { color: 'teal', text: 'Executando' },
        { color: 'pink', spinner: { name: 'ellipsis', interval: 400 } },
        { color: 'yellow', spinner: { name: 'circleHalves' } },
        { color: 'red', text: 'Executando...' },
    ]);

    // context.messagePanel.setSpinner({ name: 'dots3' });

    context.messagePanel.setProgressBarStyle({
        color: 'red',
    });

    context.messagePanel.updateProgressBarPercentage(0);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(10);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(20);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(30);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(40);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.setProgressBarStyle({
        color: 'green',
    });

    context.messagePanel.updateProgressBarPercentage(50);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(60);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(70);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(80);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(90);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.messagePanel.updateProgressBarPercentage(100);
    await new Promise((resolve) => setTimeout(resolve, 4000000));
};

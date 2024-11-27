import { ActionFunction, PipelineContext, ProgressBarProps } from 'types';

export const createTodo: ActionFunction = async (context: PipelineContext): Promise<any> => {
    console.log(window.getComputedStyle(document.body).fontFamily);

    context.printer.setDisplayText('Executando...');

    context.printer.setDisplaySpinner({ name: 'dots3' });

    context.printer.setProgressBarStyle({
        color: 'red',
    });

    context.printer.updateProgressBarPercentage(0);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(10);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(20);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(30);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(40);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.setProgressBarStyle({
        color: 'green',
    });

    context.printer.updateProgressBarPercentage(50);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(60);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(70);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(80);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(90);
    await new Promise((resolve) => setTimeout(resolve, 400));

    context.printer.updateProgressBarPercentage(100);
    await new Promise((resolve) => setTimeout(resolve, 400));
};

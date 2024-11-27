import { ActionFunction, PipelineContext, ProgressBarStyleName, TableContent } from 'types';

export const createTodo: ActionFunction = async (context: PipelineContext): Promise<any> => {
    console.log(window.getComputedStyle(document.body).fontFamily);

    const style: ProgressBarStyleName = 'slanted';
    const totalLength = 15;
    const spinnerName = 'dots3';

    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 0 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 10 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 20 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 30 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 40 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 50 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 60 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 70 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 80 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 90 },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    context.printer.display({
        output: 'Executando...',
        spinner: { name: spinnerName },
        progressBar: { totalLength, style, percentage: 100 },
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
};

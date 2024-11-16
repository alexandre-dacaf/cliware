import { ActionFunction, PipelineContext } from 'types';

export const createTodo: ActionFunction = async (context: PipelineContext): Promise<any> => {
    context.printer.display('Executando...');

    await new Promise((resolve) => setTimeout(resolve, 1000));
    // context.printer.clearDisplay();

    return { teste: 'abc123' };
};

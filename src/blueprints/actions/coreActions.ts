import { PipelineContext, ActionFunction } from '../../types';

export const changeTerminalColumns: ActionFunction = (context: PipelineContext) => {
    if (!context.commandArgs || !context.commandArgs.args[0]) return;

    const columns: number = +context.commandArgs.args[0];
    if (!columns) {
        throw new Error("Insira um número de colunas. Ex.: 'columns 3'.");
    }

    context.appDispatcher.changeTerminalColumns(columns);
};

export const createTerminal = (context: PipelineContext) => {
    context.appDispatcher.createTerminal();
};

export const deleteTerminal = (context: PipelineContext) => {
    context.appDispatcher.deleteCurrentTerminal();
};

import { Pipeline, Action } from '../../types';

export const changeTerminalColumns: Action.ActionFunction = (context: Pipeline.Context) => {
    if (!context.commandArgs || !context.commandArgs.args[0]) return;

    const columns: number = +context.commandArgs.args[0];

    if (!columns) {
        throw new Error("Insira um número de colunas. Ex.: 'columns 3'.");
    }

    context.hooks.appDispatcher.changeTerminalColumns(columns);
};

export const createTerminal = (context: Pipeline.Context) => {
    context.hooks.appDispatcher.createTerminal();
};

export const deleteTerminal = (context: Pipeline.Context) => {
    context.hooks.appDispatcher.deleteCurrentTerminal();
};

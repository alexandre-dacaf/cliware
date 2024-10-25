import { ActionFunction } from '../../types';

export const changeTerminalColumns: ActionFunction = (
    taskKey,
    taskStream,
    print,
    display,
    clearDisplay
) => {
    if (taskStream) {
        const columns: number = +taskStream.$cmd.args[0];

        if (!columns) {
            throw new Error("Insira um número de colunas. Ex.: 'columns 3'.");
        }

        const event = new CustomEvent('changeTerminalColumns', {
            detail: { columns },
        });
        window.dispatchEvent(event);
    }
};

export const createTerminal = () => {
    const event = new CustomEvent('createTerminal');
    window.dispatchEvent(event);
};

export const deleteTerminal = () => {
    const event = new CustomEvent('deleteTerminal');
    window.dispatchEvent(event);
};

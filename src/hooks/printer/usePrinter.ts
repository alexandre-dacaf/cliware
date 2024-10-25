import { HistoryEntry } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';

const usePrinter = () => {
    const { dispatch } = useContext(TerminalContext);

    const print = (payload: HistoryEntry | HistoryEntry[]) => {
        dispatch({ type: 'ADD_OUTPUT_TO_TERMINAL_HISTORY', payload });
    };

    const display = (output: string | JSX.Element) => {
        if (typeof output === 'string') {
            dispatch({ type: 'SET_TRANSIENT_OUTPUT', payload: output });
        }
    };

    const clearDisplay = () => {
        dispatch({ type: 'CLEAR_TRANSIENT_OUTPUT' });
    };

    const printCommand = (message: string) => {
        print({ type: 'command', content: `$ ${message}` });
    };

    const printInput = (message: string) => {
        print({ type: 'input', content: message });
    };

    const printOutput = (output: string | JSX.Element) => {
        if (typeof output === 'string') {
            print({ type: 'output', content: output });
        }
    };

    const printError = (error: any) => {
        print({ type: 'error', content: error?.message ?? 'ERROR' });
    };

    return {
        print,
        printCommand,
        printInput,
        printOutput,
        printError,
        display,
        clearDisplay,
    };
};

export default usePrinter;

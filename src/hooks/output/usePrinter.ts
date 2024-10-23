import { HistoryEntry } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';

const usePrinter = () => {
    const { dispatch } = useContext(TerminalContext);

    const printOnTerminalHistory = (payload: HistoryEntry | HistoryEntry[]) => {
        dispatch({ type: 'ADD_OUTPUT_TO_TERMINAL_HISTORY', payload });
    };

    const printTransientOutput = (output: string | JSX.Element) => {
        if (typeof output === 'string') {
            dispatch({ type: 'SET_TRANSIENT_OUTPUT', payload: output });
        }
    };

    const clearTransientOutput = () => {
        dispatch({ type: 'CLEAR_TRANSIENT_OUTPUT' });
    };

    const printCommandOnHistory = (message: string) => {
        printOnTerminalHistory({ type: 'command', content: `$ ${message}` });
    };

    const printInputOnHistory = (message: string) => {
        printOnTerminalHistory({ type: 'input', content: message });
    };

    const printOutputOnHistory = (output: string | JSX.Element) => {
        if (typeof output === 'string') {
            printOnTerminalHistory({ type: 'output', content: output });
        }
    };

    const printErrorOnHistory = (error: any) => {
        printOnTerminalHistory({ type: 'error', content: error?.message ?? 'ERROR' });
    };

    return {
        printOnTerminalHistory,
        printCommandOnHistory,
        printInputOnHistory,
        printOutputOnHistory,
        printErrorOnHistory,
        printTransientOutput,
        clearTransientOutput,
    };
};

export default usePrinter;

import { HistoryEntry, PrinterInterface, TableContent } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const usePrinter = (): PrinterInterface => {
    const { state, dispatch } = useContext(TerminalContext);

    const createHistoryGroup = (initialEntries?: HistoryEntry | HistoryEntry[]) => {
        const newGroupId = uuidv4();
        const entries = initialEntries ?? [];

        dispatch({
            type: 'CREATE_NEW_HISTORY_GROUP',
            payload: { currentGroupId: state.currentHistoryGroupId, newGroupId, entries },
        });
    };

    const print = (entries: HistoryEntry | HistoryEntry[]) => {
        dispatch({
            type: 'ADD_OUTPUT_TO_TERMINAL_HISTORY',
            payload: { currentGroupId: state.currentHistoryGroupId, entries: entries },
        });
    };

    const display = (output: string) => {
        if (typeof output === 'string') {
            dispatch({ type: 'SET_TRANSIENT_OUTPUT', payload: output });
        }
    };

    const clearDisplay = () => {
        dispatch({ type: 'CLEAR_TRANSIENT_OUTPUT' });
    };

    const printCommand = (message: string) => {
        print({ type: 'command', content: `> ${message}` });
    };

    const printInput = (message: string) => {
        print({ type: 'input', content: message });
    };

    const printOutput = (output: string) => {
        if (typeof output === 'string') {
            print({ type: 'output', content: output });
        }
    };

    const printError = (error: any) => {
        print({ type: 'error', content: error?.message ?? error ?? 'ERROR' });
    };

    const printTable = (tableContent: TableContent) => {
        print({ type: 'table', content: tableContent });
    };

    return {
        createHistoryGroup,
        print,
        printCommand,
        printInput,
        printOutput,
        printError,
        printTable,
        display,
        clearDisplay,
    };
};

export default usePrinter;

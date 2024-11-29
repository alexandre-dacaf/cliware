import { History, Table, Text, Hooks } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ensureArray } from 'services';

const useHistoryLogger = (): Hooks.UseHistoryLoggerMethods => {
    const { state, dispatch } = useContext(TerminalContext);

    const print = (entries: History.HistoryEntry | History.HistoryEntry[]) => {
        dispatch({
            type: 'LOG_HISTORY_ENTRY',
            payload: { currentGroupId: state.currentHistoryGroupId, entries },
        });
    };

    const printText = (content: Text.RichText) => {
        const contentArray = ensureArray(content);
        print({ type: 'text', content: contentArray });
    };

    const printCommand = (message: string) => {
        printText({ color: 'blue', text: `> ${message}` });
    };

    const printCommandNotFound = (commandString: string) => {
        const newGroupId = uuidv4();

        dispatch({
            type: 'COMMAND_NOT_FOUND',
            payload: {
                currentGroupId: state.currentHistoryGroupId,
                newGroupId,
                commandString,
            },
        });
    };

    const printPromptResponse = (message: string) => {
        printText({ color: 'neutral-800', text: message });
    };

    const printSuccess = (message: string) => {
        if (typeof message === 'string') {
            printText({ color: 'green', text: message });
        }
    };

    const printAlert = (message: string) => {
        if (typeof message === 'string') {
            printText({ color: 'yellow', text: message });
        }
    };

    const printError = (error: any) => {
        const text = error?.message ?? error ?? 'ERROR';
        printText({ color: 'red', text });
    };

    const printTable = (tableContent: Table.TableContent) => {
        print({ type: 'table', content: tableContent });
    };

    const printJson = (json: object) => {
        print({ type: 'json', content: json });
    };

    return {
        print,
        printText,
        printCommand,
        printCommandNotFound,
        printPromptResponse,
        printSuccess,
        printAlert,
        printError,
        printTable,
        printJson,
    };
};

export default useHistoryLogger;

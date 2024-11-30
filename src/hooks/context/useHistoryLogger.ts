import { History, Table, Text, Hooks } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ensureArray } from 'services';

const useHistoryLogger = (): Hooks.UseHistoryLoggerMethods => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);

    const log = (entries: History.HistoryEntry | History.HistoryEntry[]) => {
        const currentBlockId = terminalState.currentHistoryBlockId;

        terminalDispatch({
            type: 'LOG_HISTORY_ENTRY',
            payload: { currentBlockId, entries },
        });
    };

    const logRichText = (content: Text.RichText) => {
        const contentArray = ensureArray(content);
        log({ type: 'text', content: contentArray });
    };

    const logPromptResponse = (message: string) => {
        logRichText({ color: 'neutral-800', text: message });
    };

    const logSuccess = (message: string) => {
        logRichText({ color: 'green', text: message });
    };

    const logAlert = (message: string) => {
        logRichText({ color: 'yellow', text: message });
    };

    const logError = (error: any) => {
        const text = error?.message ?? error ?? 'ERROR';
        logRichText({ color: 'red', text });
    };

    const logTable = (tableContent: Table.TableContent) => {
        log({ type: 'table', content: tableContent });
    };

    const logJson = (json: object) => {
        log({ type: 'json', content: json });
    };

    return {
        log,
        logRichText,
        logPromptResponse,
        logSuccess,
        logAlert,
        logError,
        logTable,
        logJson,
    };
};

export default useHistoryLogger;

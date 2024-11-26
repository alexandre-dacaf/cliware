import {
    HistoryEntry,
    PrinterInterface,
    SpinnerProps,
    TableEntryContent,
    GenerateSpinnerConfigProps,
    TextSpan,
    Command,
} from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    ensureArray,
    generateSpinnerConfig,
    getExtensionFromMimeType,
    hasValidExtension,
} from 'services';

const usePrinter = (): PrinterInterface => {
    const { state, dispatch } = useContext(TerminalContext);

    const display = (output: string, spinner?: GenerateSpinnerConfigProps) => {
        const spinnerConfig: SpinnerProps | null = generateSpinnerConfig(spinner);

        dispatch({
            type: 'SET_DISPLAY',
            payload: {
                output,
                spinner: spinnerConfig,
            },
        });
    };

    const clearDisplay = () => {
        dispatch({ type: 'CLEAR_DISPLAY' });
    };

    const print = (entries: HistoryEntry | HistoryEntry[]) => {
        dispatch({
            type: 'ADD_ENTRY_TO_TERMINAL_HISTORY',
            payload: { currentGroupId: state.currentHistoryGroupId, entries },
        });
    };

    const printText = (content: TextSpan | TextSpan[]) => {
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

    const printTable = (tableContent: TableEntryContent) => {
        print({ type: 'table', content: tableContent });
    };

    const printJson = (json: object) => {
        print({ type: 'json', content: json });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            printText({ color: 'purple', text: 'Texto copiado para a área de transferência!' });
        } catch (error) {
            printText({ color: 'red', text: 'Falha ao copiar para a área de transferência!' });
        }
    };

    const downloadFile = (filename: string, content: string, mimeType: string) => {
        try {
            const extension = getExtensionFromMimeType(mimeType);
            const finalFilename = hasValidExtension(filename, extension)
                ? filename
                : `${filename}.${extension}`;

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            printText({
                color: 'purple',
                text: `File ${finalFilename} has been generated and is ready for download.`,
            });
        } catch (error) {
            printText({ color: 'red', text: 'Error generating file.' });
        }
    };

    const downloadAsTxt = (filename: string, content: string) => {
        downloadFile(filename, content, 'text/plain');
    };

    const downloadAsCsv = (
        filename: string,
        tableContent: TableEntryContent,
        separator: string = ','
    ) => {
        const { columns, data } = tableContent;

        // Generate the CSV headers using the column headers
        const headers = columns.map((column) => column.header).join(separator);

        // Generate the CSV rows based on the data
        const rows = data.map((row) =>
            columns
                .map((column) => {
                    const cellValue = row[column.key] ?? ''; // Handle missing values as empty strings
                    return `"${String(cellValue).replace(/"/g, '""')}"`; // Escape double quotes
                })
                .join(separator)
        );

        // Combine headers and rows into a single CSV string
        const csvContent = [headers, ...rows].join('\n');

        downloadFile(filename, csvContent, 'text/csv');
    };

    const downloadAsJson = (filename: string, json: object) => {
        const jsonString = JSON.stringify(json, null, 2);
        downloadFile(filename, jsonString, 'application/json');
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
        display,
        clearDisplay,
        copyToClipboard,
        downloadAsTxt,
        downloadAsCsv,
        downloadAsJson,
    };
};

export default usePrinter;

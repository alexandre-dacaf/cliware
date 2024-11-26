import {
    HistoryEntry,
    PrinterInterface,
    SpinnerProps,
    TableContent,
    GenerateSpinnerConfigProps,
} from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateSpinnerConfig, getExtensionFromMimeType, hasValidExtension } from 'services';

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
            type: 'ADD_ENTRY_TO_TERMINAL_HISTORY',
            payload: { currentGroupId: state.currentHistoryGroupId, entries: entries },
        });
    };

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

    const printJson = (jsonString: string) => {
        print({ type: 'json', content: jsonString });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            printOutput('Texto copiado para a área de transferência!');
        } catch (error) {
            printError('Falha ao copiar para a área de transferência.');
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

            printOutput(`File ${finalFilename} has been generated and is ready for download.`);
        } catch (error) {
            printError('Error generating file.');
        }
    };

    const downloadAsTxt = (filename: string, content: string) => {
        downloadFile(filename, content, 'text/plain');
    };

    const downloadAsCsv = (
        filename: string,
        tableContent: TableContent,
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

    const downloadAsJson = (filename: string, jsonContent: object) => {
        const jsonString = JSON.stringify(jsonContent, null, 2);
        downloadFile(filename, jsonString, 'application/json');
    };

    return {
        createHistoryGroup,
        print,
        printCommand,
        printInput,
        printOutput,
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

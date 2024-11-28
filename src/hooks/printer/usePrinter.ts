import { History, MessagePanel, Content, Hooks } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    ensureArray,
    generateSpinnerProps,
    getExtensionFromMimeType,
    hasValidExtension,
} from 'services';

const usePrinter = (): Hooks.PrinterInterface => {
    const { state, dispatch } = useContext(TerminalContext);

    const setDisplayText = (text: string) => {
        dispatch({ type: 'SET_DISPLAY_TEXT', payload: text });
    };

    const setDisplaySpinner = (config: MessagePanel.SpinnerConfig) => {
        const spinner = generateSpinnerProps(config);
        if (!spinner) return;

        dispatch({ type: 'SET_DISPLAY_SPINNER', payload: spinner });
    };

    const setProgressBarStyle = (style: MessagePanel.ProgressBarStyle | null) => {
        dispatch({ type: 'SET_PROGRESS_BAR_STYLE', payload: style });
    };

    const updateProgressBarPercentage = (percentage: number) => {
        dispatch({ type: 'UPDATE_PROGRESS_BAR_PERCENTAGE', payload: percentage });
    };

    const clearDisplay = () => {
        dispatch({ type: 'CLEAR_DISPLAY' });
    };

    const print = (entries: History.HistoryEntry | History.HistoryEntry[]) => {
        dispatch({
            type: 'LOG_HISTORY_ENTRY',
            payload: { currentGroupId: state.currentHistoryGroupId, entries },
        });
    };

    const printText = (content: Content.Text.TextSpan | Content.Text.TextSpan[]) => {
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

    const printTable = (tableContent: Content.Table.TableContent) => {
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
        tableContent: Content.Table.TableContent,
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
        setDisplayText,
        setDisplaySpinner,
        setProgressBarStyle,
        updateProgressBarPercentage,
        clearDisplay,
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
        copyToClipboard,
        downloadAsTxt,
        downloadAsCsv,
        downloadAsJson,
    };
};

export default usePrinter;

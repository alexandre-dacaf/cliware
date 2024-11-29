import { Table, Hooks } from 'types';
import { getExtensionFromMimeType, hasValidExtension } from 'services';
import useHistoryLogger from './useHistoryLogger';

const useFileDownloader = (): Hooks.UseFileDowloaderMethods => {
    const { printSuccess, printError } = useHistoryLogger();

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

            printSuccess(`File ${finalFilename} has been generated and is ready for download.`);
        } catch (error) {
            printError('Error generating file.');
        }
    };

    const downloadAsTxt = (filename: string, content: string) => {
        downloadFile(filename, content, 'text/plain');
    };

    const downloadAsCsv = (
        filename: string,
        tableContent: Table.TableContent,
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
        downloadAsTxt,
        downloadAsCsv,
        downloadAsJson,
    };
};

export default useFileDownloader;

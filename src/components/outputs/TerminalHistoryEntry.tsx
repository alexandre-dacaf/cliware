import React from 'react';
import './TerminalHistoryEntry.css';
import { HistoryEntry, TableContent, TableEntry } from 'types';

interface TerminalHistoryEntryProps {
    entry: HistoryEntry;
}

const TerminalHistoryEntry: React.FC<TerminalHistoryEntryProps> = ({ entry }) => {
    switch (entry.type) {
        case 'command':
            return <div className={`terminal-command`}>{entry.content}</div>;
        case 'error':
            return <div className={`terminal-error`}>{entry.content}</div>;
        case 'input':
            return <div className={`terminal-input`}>{entry.content}</div>;
        case 'output':
            return <div className={`terminal-output`}>{entry.content}</div>;
        case 'table':
            return <TableView tableContent={entry.content} />;
        case 'json':
            return <JsonView jsonString={entry.content} />;
        default:
            return null;
    }
};

interface JsonViewProps {
    jsonString: string;
}

const JsonView: React.FC<JsonViewProps> = ({ jsonString }) => {
    let parsedJson: any;

    try {
        parsedJson = JSON.parse(jsonString);
    } catch (error) {
        return <div className='terminal-error'>Invalid JSON</div>;
    }

    return <pre className='json-container'>{JSON.stringify(parsedJson, null, 2)}</pre>;
};

interface TableViewProps {
    tableContent: TableContent;
}

const TableView: React.FC<TableViewProps> = ({ tableContent }) => {
    const columns = tableContent.columns;
    const data = tableContent.data;

    return (
        <table className='terminal-table'>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => (
                            <td key={column.key}>{row[column.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

TerminalHistoryEntry.displayName = 'TerminalHistoryEntry';

export default TerminalHistoryEntry;

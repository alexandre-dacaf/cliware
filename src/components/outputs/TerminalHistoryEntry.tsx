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
            return <JsonView json={entry.content} />;
        default:
            return null;
    }
};

interface JsonViewProps {
    json: object;
}

const JsonView: React.FC<JsonViewProps> = ({ json }) => {
    return <pre className='json-container'>{JSON.stringify(json, null, 2)}</pre>;
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

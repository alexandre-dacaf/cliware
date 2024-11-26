import React from 'react';
import './TerminalHistoryEntry.css';
import { HistoryEntry, TableEntryContent, TableEntry, TextSpan } from 'types';
import { ensureArray } from 'services';

interface TerminalHistoryEntryProps {
    entry: HistoryEntry;
}

const TerminalHistoryEntry: React.FC<TerminalHistoryEntryProps> = ({ entry }) => {
    switch (entry.type) {
        case 'text':
            return <TextView content={entry.content} />;
        case 'table':
            return <TableView tableContent={entry.content} />;
        case 'json':
            return <JsonView json={entry.content} />;
        default:
            return null;
    }
};

interface TextViewProps {
    content: TextSpan | TextSpan[];
}

const TextView: React.FC<TextViewProps> = ({ content }) => {
    const contentArray = ensureArray(content);

    return (
        <div className='terminal-text'>
            {contentArray.map((textEntryContent, index) => {
                const color = textEntryContent.color ?? 'neutral-500';
                const className = `terminal-output terminal__${color}`;
                const style = { color: `var(--${color})` };

                return (
                    <span key={index} className={className}>
                        {textEntryContent.text}
                    </span>
                );
            })}
        </div>
    );
};

interface JsonViewProps {
    json: object;
}

const JsonView: React.FC<JsonViewProps> = ({ json }) => {
    return <pre className='terminal-json'>{JSON.stringify(json, null, 2)}</pre>;
};

interface TableViewProps {
    tableContent: TableEntryContent;
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

import RichText from 'components/text/RichText';
import React from 'react';
import { History as H, Table } from 'types';
import './HistoryEntry.scss';

interface HistoryEntryProps {
    entry: H.HistoryEntry;
}

const HistoryEntry: React.FC<HistoryEntryProps> = ({ entry }) => {
    switch (entry.type) {
        case 'text':
            return <RichText content={entry.content} />;
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
    return <pre className='terminal-json'>{JSON.stringify(json, null, 2)}</pre>;
};

interface TableViewProps {
    tableContent: Table.TableContent;
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

HistoryEntry.displayName = 'HistoryEntry';

export default HistoryEntry;

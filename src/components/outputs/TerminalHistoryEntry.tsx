import React from 'react';
import './TerminalHistoryEntry.css';
import { HistoryEntry } from 'types';

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
            const columns = entry.content.columns;
            const data = entry.content.data;

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
        default:
            return null;
    }
};

TerminalHistoryEntry.displayName = 'TerminalHistoryEntry';

export default TerminalHistoryEntry;

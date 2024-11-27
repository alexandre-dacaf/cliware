import React, { useContext } from 'react';
import TerminalHistoryEntry from './TerminalHistoryEntry';
import { TerminalContext } from 'context/TerminalContext';
import { HistoryGroup } from 'types';
import './TerminalHistory.scss';

export const TerminalHistory: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory
                .filter((group) => group.id !== state.currentHistoryGroupId)
                .map((group, index) => {
                    return <TerminalHistoryGroup key={index} group={group} className='history-group' />;
                })}
        </div>
    );
};

interface TerminalHistoryGroupProps {
    group: HistoryGroup;
    className: string;
}

export const TerminalHistoryGroup: React.FC<TerminalHistoryGroupProps> = ({ group, className }) => {
    return (
        <div className={className}>
            {group.entries.map((entry, index) => {
                return <TerminalHistoryEntry key={index} entry={entry} />;
            })}
        </div>
    );
};

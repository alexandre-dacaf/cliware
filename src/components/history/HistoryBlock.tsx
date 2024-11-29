import HistoryEntry from 'components/history/HistoryEntry';
import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import { History as H } from 'types';
import './HistoryBlock.scss';

interface HistoryBlockProps {
    group: H.HistoryBlock;
    className: string;
}

const HistoryBlock: React.FC<HistoryBlockProps> = ({ group, className }) => {
    return (
        <div className={className}>
            {group.entries.map((entry, index) => {
                return <HistoryEntry key={index} entry={entry} />;
            })}
        </div>
    );
};

HistoryBlock.displayName = 'HistoryBlock';

export default HistoryBlock;

import HistoryEntry from 'components/history/HistoryEntry';
import React from 'react';
import { History as H } from 'types';
import './ArchivedHistoryBlock.scss';

interface ArchivedHistoryBlockProps {
    block: H.HistoryBlock;
}

const ArchivedHistoryBlock: React.FC<ArchivedHistoryBlockProps> = ({ block }) => {
    return (
        <div className='archived-history-block'>
            {block.entries.map((entry, index) => {
                return <HistoryEntry key={index} entry={entry} />;
            })}
        </div>
    );
};

ArchivedHistoryBlock.displayName = 'HistoryBlock';

export default ArchivedHistoryBlock;

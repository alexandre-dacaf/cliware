import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import './History.scss';
import ArchivedHistoryBlock from './ArchivedHistoryBlock';

const History: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory
                .filter((block) => block.id !== state.currentHistoryBlockId)
                .map((block, index) => {
                    return <ArchivedHistoryBlock key={index} block={block} />;
                })}
        </div>
    );
};

History.displayName = 'History';

export default History;

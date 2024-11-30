import HistoryBlock from 'components/history/HistoryBlock';
import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import './History.scss';

const History: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory
                .filter((group) => group.id !== state.currentHistoryBlockId)
                .map((group, index) => {
                    return <HistoryBlock key={index} group={group} className='history-block' />;
                })}
        </div>
    );
};

History.displayName = 'History';

export default History;

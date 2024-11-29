import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import './History.scss';
import HistoryBlock from 'components/history/HistoryBlock';

const History: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory
                .filter((group) => group.id !== state.currentHistoryGroupId)
                .map((group, index) => {
                    return <HistoryBlock key={index} group={group} className='history-group' />;
                })}
        </div>
    );
};

History.displayName = 'History';

export default History;

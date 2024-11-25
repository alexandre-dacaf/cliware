import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './PrintHistory.css';

const PrintHistory: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory
                .filter((group) => group.id !== state.currentHistoryGroupId)
                .map((group) => {
                    return (
                        <div key={group.id} className='history-group'>
                            {group.entries.map((entry, index) => {
                                return (
                                    <div key={index} className={`terminal-${entry.type}`}>
                                        {entry.content}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
        </div>
    );
};

PrintHistory.displayName = 'PrintHistory';

export default PrintHistory;

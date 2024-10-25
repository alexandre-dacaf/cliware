import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './PrintHistory.css';

const PrintHistory: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className='history'>
            {state.printHistory.map((entry, index) => {
                return (
                    <div key={index} className={`terminal-${entry.type}`}>
                        {entry.content}
                    </div>
                );
            })}
        </div>
    );
};

PrintHistory.displayName = 'PrintHistory';

export default PrintHistory;

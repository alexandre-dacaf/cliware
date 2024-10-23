import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './TerminalOutputHistory.css';

const TerminalOutputHistory: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return (
        <div className="history">
            {state.terminalOutputHistory.map((entry, index) => {
                return (
                    <div key={index} className={`terminal-${entry.type}`}>
                        {entry.content}
                    </div>
                );
            })}
        </div>
    );
};

TerminalOutputHistory.displayName = 'TerminalOutputHistory';

export default TerminalOutputHistory;

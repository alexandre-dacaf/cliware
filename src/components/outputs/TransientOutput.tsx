import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './TransientOutput.css';

const TransientOutput: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return state.transientOutput ? <div className="terminal-transient">{state.transientOutput}</div> : null;
};

TransientOutput.displayName = 'TransientOutput';

export default TransientOutput;

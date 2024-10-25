import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './Display.css';

const Display: React.FC = () => {
    const { state } = useContext(TerminalContext);

    return state.display ? <div className='terminal-transient'>{state.display}</div> : null;
};

Display.displayName = 'Display';

export default Display;

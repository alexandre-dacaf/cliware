import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import './Display.css';
import Spinner from './Spinner';
import { SpinnerProps } from 'types';

const Display: React.FC = () => {
    const { state } = useContext(TerminalContext);

    if (!state.display) return null;

    const renderSpinner = () => {
        if (!state.display?.spinner) return null;

        const spinnerProps: SpinnerProps = state.display.spinner;

        return <Spinner {...spinnerProps} />;
    };

    return (
        <div className='terminal-transient'>
            {renderSpinner()}
            &nbsp;
            {state.display.output}
        </div>
    );
};

Display.displayName = 'Display';

export default Display;

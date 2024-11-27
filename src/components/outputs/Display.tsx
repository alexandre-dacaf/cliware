import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import { ProgressBarProps, SpinnerProps } from 'types';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';
import './Display.css';

const Display: React.FC = () => {
    const { state } = useContext(TerminalContext);

    if (!state.display) return null;

    const renderSpinner = () => {
        if (!state.display?.spinner) return null;

        const spinnerProps: SpinnerProps = state.display.spinner;

        return <Spinner {...spinnerProps} />;
    };

    const renderProgressBar = () => {
        if (!state.display?.progressBar) return null;

        const progressBarProps: ProgressBarProps = state.display.progressBar;

        return <ProgressBar {...progressBarProps} />;
    };

    return (
        <div className='terminal-transient'>
            {renderSpinner()}
            &nbsp;
            {state.display.output}
            {renderProgressBar()}
        </div>
    );
};

Display.displayName = 'Display';

export default Display;

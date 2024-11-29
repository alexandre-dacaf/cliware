import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import { MessagePanel as MP } from 'types';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';
import './MessagePanel.scss';

const MessagePanel: React.FC = () => {
    const { state } = useContext(TerminalContext);

    if (!state.display) return null;

    const renderSpinner = () => {
        if (!state.display?.spinner) return null;

        const spinnerProps: MP.Spinner = state.display.spinner;

        return (
            <span>
                <Spinner {...spinnerProps} />
                &nbsp;
            </span>
        );
    };

    const renderProgressBar = () => {
        if (!state.display?.progressBar) return null;

        const progressBarProps: MP.ProgressBarProps = state.display.progressBar;

        return <ProgressBar {...progressBarProps} />;
    };

    return (
        <div className='message-panel'>
            {renderSpinner()}
            {state.display.text}
            {renderProgressBar()}
        </div>
    );
};

MessagePanel.displayName = 'Display';

export default MessagePanel;

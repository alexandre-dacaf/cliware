import React, { useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';
import { Text, MessagePanel as MP } from 'types';
import Spinner from '../text/Spinner';
import ProgressBar from './ProgressBar';
import './MessagePanel.scss';
import RichText from 'components/text/RichText';

const MessagePanel: React.FC = () => {
    const { state } = useContext(TerminalContext);

    if (!state.display) return null;

    const renderSpinner = () => {
        if (!state.display?.spinner) return null;

        const spinnerProps: Text.Spinner = state.display.spinner;

        return (
            <span>
                <Spinner {...spinnerProps} />
                &nbsp;
            </span>
        );
    };

    const renderText = () => {
        if (!state.display?.text) return null;

        const textProps: Text.RichText = state.display.text;

        return <RichText content={textProps} />;
    };

    const renderProgressBar = () => {
        if (!state.display?.progressBar) return null;

        const progressBarProps: MP.ProgressBar = state.display.progressBar;

        return <ProgressBar {...progressBarProps} />;
    };

    return (
        <div className='message-panel'>
            {renderSpinner()}
            {renderText()}
            {renderProgressBar()}
        </div>
    );
};

MessagePanel.displayName = 'Display';

export default MessagePanel;

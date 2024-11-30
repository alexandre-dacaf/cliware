import RichText from 'components/text/RichText';
import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import { MessagePanel as MP, Text } from 'types';
import './MessagePanel.scss';
import ProgressBar from './ProgressBar';
import SlideIn from 'components/animations/SlideIn';
import FadeIn from 'components/animations/FadeIn';
import SlideDown from 'components/animations/SlideDown';

const MessagePanel: React.FC = () => {
    const { state } = useContext(TerminalContext);

    if (!state.display) return null;

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
            <SlideIn key={1} duration={0.2}>
                {renderText()}
                {renderProgressBar()}
            </SlideIn>
        </div>
    );
};

MessagePanel.displayName = 'Display';

export default MessagePanel;

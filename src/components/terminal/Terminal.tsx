import History from 'components/history/History';
import HistoryBlock from 'components/history/HistoryBlock';
import IdleConsole from 'components/idle-console/IdleConsole';
import MessagePanel from 'components/message-panel/MessagePanel';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import React, { useContext, useEffect, useRef } from 'react';
import Pipeline from './managers/Pipeline';
import './Terminal.scss';

interface TerminalProps {
    isActive: boolean;
    isSelected: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isActive, isSelected }) => {
    return (
        <TerminalProvider>
            <TerminalBody isActive={isActive} isSelected={isSelected} />
        </TerminalProvider>
    );
};

const TerminalBody: React.FC<TerminalProps> = ({ isActive, isSelected }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const { state: terminalState } = useContext(TerminalContext);
    const terminalClassName = `
        terminal ${isActive ? 'active-terminal ' : ' '} ${isSelected ? 'selected-terminal ' : ' '}
    `;

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        setTimeout(() => {
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
            }
        }, 100);
    }, [terminalState]);

    const renderActiveHistoryBlock = () => {
        return terminalState.printHistory
            .filter((group) => group.id === terminalState.currentHistoryBlockId)
            .map((group, index) => {
                return <HistoryBlock key={index} group={group} className='current-history-group' />;
            });
    };

    const renderConsole = () => {
        if (terminalState.commandArgs) {
            return <Pipeline isActive={isActive} />;
        }

        return <IdleConsole isActive={isActive} />;
    };

    return (
        <div className={terminalClassName} ref={terminalRef}>
            <History />
            <div className='current-command-container'>
                {renderActiveHistoryBlock()}
                {renderConsole()}
                <MessagePanel />
            </div>
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

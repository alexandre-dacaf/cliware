import { blueprint } from 'blueprints/blueprint';
import History from 'components/history/History';
import HistoryBlock from 'components/history/HistoryBlock';
import IdleConsole from 'components/idle-console/IdleConsole';
import MessagePanel from 'components/message-panel/MessagePanel';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import useHistoryLogger from 'hooks/context/useHistoryLogger';
import React, { useContext, useEffect, useRef } from 'react';
import { Command } from 'types';
import { v4 as uuidv4 } from 'uuid';
import TaskManager from './managers/TaskManager';
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
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const { printCommandNotFound } = useHistoryLogger();

    const availableCommands = useRef(Object.keys(blueprint).sort());

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        setTimeout(() => {
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
            }
        }, 100);
    }, [terminalState]);

    const handleCommandSubmit = (commandString: string, commandArgs: Command.Args) => {
        const command: Command.Blueprint = blueprint[commandArgs.command];

        if (!command) {
            printCommandNotFound(commandString);
            return;
        }

        const newGroupId = uuidv4();

        terminalDispatch({
            type: 'START_NEW_COMMAND',
            payload: {
                currentGroupId: terminalState.currentHistoryGroupId,
                newGroupId,
                commandString,
                command,
                commandArgs,
            },
        });
    };

    return (
        <div
            className={
                'terminal ' +
                (isActive ? 'active-terminal ' : ' ') +
                (isSelected ? 'selected-terminal ' : ' ')
            }
            ref={terminalRef}
        >
            <History />

            <div className='current-command-container'>
                {terminalState.printHistory
                    .filter((group) => group.id === terminalState.currentHistoryGroupId)
                    .map((group) => {
                        return <HistoryBlock group={group} className='current-history-group' />;
                    })}
                {terminalState.command ? (
                    <TaskManager isActive={isActive} />
                ) : (
                    <IdleConsole
                        availableCommands={availableCommands.current}
                        onSubmit={handleCommandSubmit}
                        isActive={isActive}
                    />
                )}
                <MessagePanel />
            </div>
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

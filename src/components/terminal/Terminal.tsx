import React, { useRef, useEffect, useContext, useMemo } from 'react';
import { blueprint } from 'blueprints/blueprint';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import { CommandArgs, Command } from 'types';
import { TerminalHistory, TerminalHistoryGroup } from 'components/outputs/TerminalHistory';
import TaskManager from './managers/TaskManager';
import Display from 'components/outputs/Display';
import CommandInput from 'components/command-input/CommandInput';
import usePrinter from 'hooks/printer/usePrinter';
import { v4 as uuidv4 } from 'uuid';
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
    const { printCommandNotFound } = usePrinter();

    const availableCommands = useRef(Object.keys(blueprint).sort());

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        setTimeout(() => {
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
            }
        }, 100);
    }, [terminalState]);

    const handleCommandSubmit = (commandString: string, commandArgs: CommandArgs) => {
        const command: Command = blueprint[commandArgs.command];

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
        <div className={'terminal ' + (isActive ? 'active-terminal ' : ' ') + (isSelected ? 'selected-terminal ' : ' ')} ref={terminalRef}>
            <TerminalHistory />

            <div className='current-command-container'>
                {terminalState.printHistory
                    .filter((group) => group.id === terminalState.currentHistoryGroupId)
                    .map((group) => {
                        return <TerminalHistoryGroup group={group} className='current-history-group' />;
                    })}
                {terminalState.command ? (
                    <TaskManager isActive={isActive} />
                ) : (
                    <CommandInput availableCommands={availableCommands.current} onSubmit={handleCommandSubmit} isActive={isActive} />
                )}
                <Display />
            </div>
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

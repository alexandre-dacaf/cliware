import React, { useRef, useEffect, useContext, useMemo } from 'react';
import { blueprint } from 'blueprints/blueprint';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import { CommandArgs, CommandBlueprint } from 'types';
import { TerminalHistory, TerminalHistoryGroup } from 'components/outputs/TerminalHistory';
import TaskManager from './managers/TaskManager';
import Display from 'components/outputs/Display';
import CommandInput from 'components/command-input/CommandInput';
import usePrinter from 'hooks/printer/usePrinter';
import './Terminal.css';

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
    const { state, dispatch } = useContext(TerminalContext);
    const { createHistoryGroup, print } = usePrinter();

    const availableCommands = useMemo(() => Object.keys(blueprint).sort(), [blueprint]);

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [state.printHistory, state.display]);

    const handleCommandSubmit = (commandString: string, commandArgs: CommandArgs) => {
        const commandBlueprint: CommandBlueprint = blueprint[commandArgs.command];

        if (commandBlueprint) {
            dispatch({
                type: 'SET_COMMAND_BLUEPRINT',
                payload: commandBlueprint,
            });
            createHistoryGroup({ type: 'command', content: `> ${commandString}` });
        } else {
            print([
                { type: 'command', content: `> ${commandString}` },
                { type: 'error', content: `Command ${commandArgs.command} not found.` },
            ]);
            dispatch({ type: 'STANDBY' });
        }
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
            <TerminalHistory />

            <div className='current-command-container'>
                {state.printHistory
                    .filter((group) => group.id === state.currentHistoryGroupId)
                    .map((group) => {
                        return (
                            <TerminalHistoryGroup group={group} className='current-history-group' />
                        );
                    })}
                {state.commandBlueprint ? (
                    <TaskManager isActive={isActive} />
                ) : (
                    <CommandInput
                        availableCommands={availableCommands}
                        onSubmit={handleCommandSubmit}
                        isActive={isActive}
                    />
                )}
                <Display />
            </div>
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

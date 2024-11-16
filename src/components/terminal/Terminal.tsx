import React, { useRef, useEffect, useContext, useMemo } from 'react';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import { blueprint } from 'blueprints/blueprint';
import { CommandArgs, CommandBlueprint } from 'types';
import TaskManager from './managers/TaskManager';
import PrintHistory from 'components/outputs/PrintHistory';
import Display from 'components/outputs/Display';
import CommandInput from 'components/command-input/CommandInput';
import usePrinter from 'hooks/printer/usePrinter';
import './Terminal.css';

interface TerminalProps {
    terminalId: string;
    isActive: boolean;
    isSelected: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ terminalId, isActive, isSelected }) => {
    return (
        <TerminalProvider>
            <TerminalBody terminalId={terminalId} isActive={isActive} isSelected={isSelected} />
        </TerminalProvider>
    );
};

const TerminalBody: React.FC<TerminalProps> = ({ terminalId, isActive, isSelected }) => {
    const { state, dispatch } = useContext(TerminalContext);
    const { print } = usePrinter();
    const terminalRef = useRef<HTMLDivElement>(null);

    const availableCommands = useMemo(() => Object.keys(blueprint).sort(), [blueprint]);

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [state.printHistory, state.display]);

    const handleCommandSubmit = (commandString: string, commandArgs: CommandArgs) => {
        dispatch({
            type: 'SET_COMMAND_ARGS',
            payload: commandArgs,
        });

        const commandBlueprint: CommandBlueprint = blueprint[commandArgs.command];

        if (commandBlueprint) {
            dispatch({
                type: 'SET_COMMAND_BLUEPRINT',
                payload: commandBlueprint,
            });
            print({ type: 'command', content: `$ ${commandString}` });
        } else {
            print([
                { type: 'command', content: `$ ${commandString}` },
                { type: 'error', content: `Command ${commandArgs.command} not found.` },
            ]);
            dispatch({ type: 'STANDBY' });
        }
    };

    return (
        <div className={'terminal ' + (isActive ? 'active-terminal ' : ' ') + (isSelected ? 'selected-terminal ' : ' ')} ref={terminalRef}>
            <PrintHistory />

            {state.commandBlueprint ? (
                <TaskManager isActive={isActive} />
            ) : (
                <CommandInput availableCommands={availableCommands} onSubmit={handleCommandSubmit} isActive={isActive} />
            )}

            <Display />
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

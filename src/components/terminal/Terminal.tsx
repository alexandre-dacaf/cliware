import React, { useRef, useEffect, useContext } from 'react';
import { TerminalContext, TerminalProvider } from 'context/TerminalContext';
import { blueprint } from 'blueprints/blueprint';
import { CommandArgs, CommandBlueprint } from 'types';
import TaskManager from './managers/TaskManager';
import TerminalOutputHistory from 'components/outputs/TerminalOutputHistory';
import TransientOutput from 'components/outputs/TransientOutput';
import CommandInput from 'components/command-input/CommandInput';
import usePrinter from 'hooks/output/usePrinter';
import './Terminal.css';

interface TerminalProps {
    terminalId: number;
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
    const { printOnTerminalHistory } = usePrinter();
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [state.terminalOutputHistory, state.transientOutput]);

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
        } else {
            printOnTerminalHistory([
                { type: 'command', content: `$ ${commandString}` },
                { type: 'error', content: `Command ${commandArgs.command} not found.` },
            ]);
            dispatch({ type: 'STANDBY' });
        }
    };

    return (
        <div className={'terminal ' + (isActive ? 'active-terminal ' : ' ') + (isSelected ? 'selected-terminal ' : ' ')} ref={terminalRef}>
            <TerminalOutputHistory />

            {state.commandBlueprint ? <TaskManager isActive={isActive} /> : <CommandInput onSubmit={handleCommandSubmit} isActive={isActive} />}

            <TransientOutput />
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

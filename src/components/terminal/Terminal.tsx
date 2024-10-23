import React, { useState, useEffect, useRef } from 'react';
import { blueprint } from 'blueprints/blueprint';
import { Task, PipelineData, PipelineDataCmd, Blueprint, CommandBlueprint } from 'types';
import { PromptHandler } from './managers/handlers/PromptHandler';
import TaskManager from './managers/TaskManager';
import CommandInput from 'components/command-input/CommandInput';
import { parseCommandArguments } from 'services/utils/parser';
import './Terminal.css';

interface HistoryEntry {
    type: 'command' | 'input' | 'output' | 'error';
    content: string | JSX.Element;
}

interface TerminalProps {
    terminalId: number;
    isActive: boolean;
    isSelected: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ terminalId, isActive, isSelected }) => {
    const [commandArgs, setCommandArgs] = useState<PipelineDataCmd | null>(null);
    const [commandBlueprint, setCommandBlueprint] = useState<CommandBlueprint | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        console.log(terminalId, commandArgs, commandBlueprint, isActive, isExecuting);
    }, [terminalId, commandArgs, commandBlueprint, isActive, isExecuting]);

    const handleCommandSubmit = (fullCommand: string, commandArgs: PipelineDataCmd) => {
        setHistory((prev: HistoryEntry[]) => [
            ...prev,
            { type: 'command', content: `$ ${fullCommand}` },
        ]);

        setCommandArgs(commandArgs);
        setCommandBlueprint(blueprint[commandArgs.command]);
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
            <div className='history'>
                {history.map((entry, index) => {
                    switch (entry.type) {
                        case 'command':
                            return (
                                <div key={index} className='terminal-command'>
                                    {entry.content}
                                </div>
                            );
                        case 'input':
                            return (
                                <div key={index} className='terminal-input'>
                                    {entry.content}
                                </div>
                            );
                        case 'output':
                            return (
                                <div key={index} className='terminal-output'>
                                    {entry.content}
                                </div>
                            );
                        case 'error':
                            return (
                                <div key={index} className='terminal-error'>
                                    {entry.content}
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {commandArgs && commandBlueprint ? (
                <TaskManager
                    terminalId={terminalId}
                    commandArgs={commandArgs}
                    commandBlueprint={commandBlueprint}
                    isActive={isActive}
                    isExecuting={isExecuting}
                    onSetIsExecuting={setIsExecuting}
                    onSetHistory={setHistory}
                />
            ) : (
                <CommandInput onSubmit={handleCommandSubmit} isActive={isActive} />
            )}

            {/* {isExecuting && <div className='loading'>Executando...</div>} */}
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

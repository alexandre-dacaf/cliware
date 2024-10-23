import React, { useState, useEffect, useRef } from 'react';
import { commandConfig } from '../../commands/commandConfig';
import { Task, PipelineData, PipelineCmdData } from '../../types';
import { PromptManager } from './managers/PromptManager';
import CommandInput from '../command-input/CommandInput';
import { parseCommandArguments } from '../../services/utils/parser';
import './Terminal.css';

interface HystoryEntry {
    type: 'command' | 'input' | 'output' | 'error';
    content: string | JSX.Element;
}

interface TerminalProps {
    terminalId: number;
    isActive: boolean;
    isSelected: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ terminalId, isActive, isSelected }) => {
    const [currentCommand, setCurrentCommand] = useState<string>('');
    const [currentTaskKey, setCurrentTaskKey] = useState<string | null>(null);
    const [pipelineData, setPipelineData] = useState<PipelineData>({
        $terminal: { terminalId },
        $cmd: { args: [], flags: [], options: {} },
        $pipeline: {},
    });
    const [history, setHistory] = useState<HystoryEntry[]>([]);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the end of the terminal whenever the history changes
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [history]);

    const handleCommandSubmit = (
        fullCommand: string,
        command: string,
        commandArgs: PipelineCmdData
    ) => {
        setHistory((prev: HystoryEntry[]) => [
            ...prev,
            { type: 'command', content: `$ ${fullCommand}` },
        ]);

        const currentCommandConfig = commandConfig[command];

        const commandEntrypoint = currentCommandConfig?.entrypoint;
        const commandPipeline = currentCommandConfig?.pipeline;

        if (commandPipeline && commandEntrypoint) {
            setPipelineData((prev) => ({
                ...prev,
                $cmd: commandArgs,
            }));
            const firstTaskKey = commandEntrypoint;
            setCurrentTaskKey(firstTaskKey);
            setCurrentCommand(command);
        } else {
            handleError({ message: `'${command}' is not a recognized command.` });
        }
    };

    const handleError = (error: any, errorInfo?: React.ErrorInfo) => {
        setHistory((prev) => [...prev, { type: 'error', content: error.message ?? 'ERROR' }]);
        setCurrentTaskKey(null);
        setCurrentCommand('');
        setIsExecuting(false);
        console.error('Erro no Terminal:', error, errorInfo);
    };

    const getCurrentTask = (): Task | null => {
        if (!currentTaskKey || !currentCommand) return null;

        const { pipeline } = commandConfig[currentCommand];
        const currentTask: Task = pipeline[currentTaskKey];

        if (!currentTask) {
            return null;
        }

        return currentTask;
    };

    const goToNextTaskFrom = (currentTask: Task) => {
        let nextTaskKey: string | null = null;

        if (currentTask.next) {
            if (typeof currentTask.next === 'function') {
                nextTaskKey = currentTask.next(pipelineData);
            } else {
                nextTaskKey = currentTask.next;
            }
        }

        const commandPipeline = commandConfig[currentCommand].pipeline;

        if (nextTaskKey && !(nextTaskKey in commandPipeline)) {
            handleError({
                message: `The next task '${nextTaskKey}' does not exist in the pipeline for the command '${currentCommand}'`,
            });
            return;
        }

        setCurrentTaskKey(nextTaskKey);
        if (!nextTaskKey) {
            setCurrentCommand('');
        }
    };

    const updatePipelineData = (currentTaskKey: string, data: any) => {
        setPipelineData((prev) => ({
            ...prev,
            $pipeline: {
                ...prev.$pipeline,
                [currentTaskKey]: data,
            },
        }));
    };

    const handlePromptResponse = (data: any, textResponse: string) => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'prompt') return;

        updatePipelineData(currentTaskKey, data);

        setHistory((prev) => [
            ...prev,
            { type: 'input', content: `${currentTask.message} ${textResponse}` },
        ]);

        goToNextTaskFrom(currentTask);
    };

    const handleActionTask = async () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'action') return;

        try {
            setIsExecuting(true);

            const response = await currentTask.actionFunction(currentTaskKey, pipelineData);

            updatePipelineData(currentTaskKey, response);

            goToNextTaskFrom(currentTask);
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleOutputTask = () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'output') return;

        try {
            const outputContent = currentTask.outputFunction(pipelineData);
            setHistory((prev) => [...prev, { type: 'output', content: outputContent }]);

            goToNextTaskFrom(currentTask);
        } catch (error: any) {
            handleError(error);
        }
    };

    // useEffect to automatically execute tasks of type 'action' and 'output'
    useEffect(() => {
        if (isExecuting) return; // Avoids multiple executions

        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask) return;

        switch (currentTask.type) {
            case 'action':
                handleActionTask();
                break;
            case 'output':
                handleOutputTask();
                break;
            default:
                break;
        }
    }, [currentTaskKey, isExecuting]);

    const renderCurrentTask = () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask) return;

        switch (currentTask.type) {
            case 'prompt':
                return (
                    <PromptManager
                        task={currentTask}
                        pipelineData={pipelineData}
                        onNext={handlePromptResponse}
                        isActive={isActive}
                    />
                );
            case 'action':
            case 'output':
                // 'action' and 'output' are not rendered directly
                return null;
            default:
                return <p>Task type unknown!</p>;
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

            {!currentCommand && <CommandInput onSubmit={handleCommandSubmit} isActive={isActive} />}

            {renderCurrentTask()}

            {isExecuting && <div className='loading'>Executando...</div>}
        </div>
    );
};

Terminal.displayName = 'Terminal';

export default Terminal;

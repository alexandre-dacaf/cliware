import React, { useState, useEffect, useRef } from 'react';
import { Task, PipelineData, PipelineDataCmd, CommandBlueprint } from 'types';
import { PromptHandler } from './handlers/PromptHandler';

interface TaskManagerProps {
    terminalId: number;
    commandArgs: PipelineDataCmd;
    commandBlueprint: CommandBlueprint;
    isActive: boolean;
    isExecuting: boolean;
    onSetIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
    onSetHistory: React.Dispatch<React.SetStateAction<any[]>>;
}

const TaskManager: React.FC<TaskManagerProps> = ({
    terminalId,
    commandArgs,
    commandBlueprint,
    isActive,
    isExecuting,
    onSetIsExecuting,
    onSetHistory,
}) => {
    const [currentCommand, setCurrentCommand] = useState<string>('');
    const [currentTaskKey, setCurrentTaskKey] = useState<string | null>(null);
    const [pipelineData, setPipelineData] = useState<PipelineData>({
        $terminal: { terminalId },
        $cmd: commandArgs,
        $responses: {},
    });

    useEffect(() => {
        setCurrentCommand(commandArgs.command);
        const commandEntrypoint = commandBlueprint.entrypoint;
        const commandPipeline = commandBlueprint.pipeline;

        if (commandPipeline && commandEntrypoint) {
            const firstTaskKey = commandEntrypoint;
            setCurrentTaskKey(firstTaskKey);
        } else {
            handleError({
                message: `'${pipelineData.$cmd.command}' is not a recognized command.`,
            });
        }
    }, []);

    const handleError = (error: any, errorInfo?: React.ErrorInfo) => {
        onSetHistory((prev) => [...prev, { type: 'error', content: error.message ?? 'ERROR' }]);
        setCurrentTaskKey(null);
        setCurrentCommand('');
        onSetIsExecuting(false);
        console.error('Erro no Terminal:', error, errorInfo);
    };

    const getCurrentTask = (): Task | null => {
        if (!currentTaskKey || !currentCommand) return null;

        const { pipeline } = commandBlueprint;
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

        const commandPipeline = commandBlueprint.pipeline;

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
            $responses: {
                ...prev.$responses,
                [currentTaskKey]: data,
            },
        }));
    };

    const handlePromptResponse = (data: any, textResponse: string) => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'prompt') return;

        updatePipelineData(currentTaskKey, data);

        onSetHistory((prev) => [
            ...prev,
            { type: 'input', content: `${currentTask.message} ${textResponse}` },
        ]);

        goToNextTaskFrom(currentTask);
    };

    const handleActionTask = async () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'action') return;

        try {
            onSetIsExecuting(true);

            const response = await currentTask.actionFunction(currentTaskKey, pipelineData);

            updatePipelineData(currentTaskKey, response);

            goToNextTaskFrom(currentTask);
        } catch (error: any) {
            handleError(error);
        } finally {
            onSetIsExecuting(false);
        }
    };

    const handleOutputTask = () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== 'output') return;

        try {
            const outputContent = currentTask.outputFunction(pipelineData);
            onSetHistory((prev) => [...prev, { type: 'output', content: outputContent }]);

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
                    <PromptHandler
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

    return renderCurrentTask();
};

TaskManager.displayName = 'TaskManager';

export default TaskManager;

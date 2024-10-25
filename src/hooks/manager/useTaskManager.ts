import { useState, useEffect, useContext } from 'react';
import { Task, TaskStream } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import usePrinter from 'hooks/printer/usePrinter';

const useTaskManager = () => {
    const { state, dispatch } = useContext(TerminalContext);
    const [taskKey, setTaskKey] = useState<string | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const [taskStream, setTaskStream] = useState<TaskStream>({});
    const { printError, print, display, clearDisplay } = usePrinter();

    useEffect(() => {
        if (state.commandBlueprint) {
            const commandBlueprint = state.commandBlueprint;
            const commandEntrypoint = commandBlueprint.entrypoint;
            const commandPipeline = commandBlueprint.pipeline;

            if (commandPipeline && commandEntrypoint) {
                const firstTaskKey = commandEntrypoint;
                setTaskKey(firstTaskKey);
            }
        }
    }, [state.commandBlueprint]);

    useEffect(() => {
        if (taskKey && state.commandBlueprint) {
            const { pipeline } = state.commandBlueprint;
            const currentTask = pipeline[taskKey];
            setTask(currentTask);
        }
    }, [taskKey]);

    useEffect(() => {
        if (isExecuting) return;

        if (!taskKey || !task) return;

        switch (task.type) {
            case 'action':
                handleActionTask();
                break;
            default:
                break;
        }
    }, [task, isExecuting]);

    const goToNextTask = () => {
        if (!task) return;

        const { next } = task;
        const commandPipeline = state.commandBlueprint?.pipeline;

        const nextTaskKey = typeof next === 'function' ? next(taskStream) : next;

        if (commandPipeline) {
            if (!nextTaskKey || !(nextTaskKey in commandPipeline)) {
                endPipelineAndStandby();
                return;
            }

            setTaskKey(nextTaskKey);
        }
    };

    const handlePromptResponse = (data: any) => {
        if (!taskKey || !task || task.type !== 'prompt') return;

        updateTaskStream(taskKey, data);

        goToNextTask();
    };

    const handleActionTask = async () => {
        if (!taskKey || !task || task.type !== 'action') return;

        try {
            setIsExecuting(true);

            const response = await task.actionFunction(
                taskKey,
                taskStream,
                print,
                display,
                clearDisplay
            );

            updateTaskStream(taskKey, response);

            goToNextTask();
        } catch (error) {
            handleError(error);
        } finally {
            setIsExecuting(false);
        }
    };

    const updateTaskStream = (currentTaskKey: string, data: any) => {
        setTaskStream((prev) => ({ ...prev, [currentTaskKey]: data }));
    };

    const handleError = (error: any) => {
        console.error('Erro no Terminal:', error?.message ?? 'ERROR');
        printError(error);
        endPipelineAndStandby();
    };

    const endPipelineAndStandby = () => {
        setTaskKey(null);
        dispatch({ type: 'STANDBY' });
    };

    return {
        state,
        currentTaskKey: taskKey,
        currentTask: task,
        taskStream,
        handlePromptResponse,
    };
};

export default useTaskManager;

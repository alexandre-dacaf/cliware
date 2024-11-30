import { blueprint } from 'blueprints/blueprint';
import { TerminalContext } from 'context/TerminalContext';
import useAppDispatcher from 'hooks/app/useAppDispatcher';
import useClipboard from 'hooks/context/useClipboard';
import useFileDownloader from 'hooks/context/useFileDownloader';
import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Command, Pipeline, Task } from 'types';

const usePipeline = () => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const [currentTask, setCurrentTask] = useState<Task.Task | null>(null);
    const [taskBreadcrumbs, setTaskBreadcrumbs] = useState<Task.TaskId[]>([]);
    const [pipelineContext, setPipelineContext] = useState<Pipeline.Context | null>(null);
    const [pipelineBlueprint, setPipelineBlueprint] = useState<Pipeline.Blueprint | null>(null);
    const isProcessing = useRef(false);
    const hooks = {
        messagePanel: useMessagePanel(),
        historyLog: useHistoryLogger(),
        clipboard: useClipboard(),
        fileDownload: useFileDownloader(),
        appDispatcher: useAppDispatcher(),
    };
    const messagePanel = useMessagePanel();
    const historyLog = useHistoryLogger();
    const clipboard = useClipboard();
    const fileDownload = useFileDownloader();
    const appDispatcher = useAppDispatcher();

    const currentTaskId = useMemo(
        () => pipelineContext?.currentTaskId,
        [pipelineContext?.currentTaskId]
    );

    useEffect(() => {
        const commandArgs = terminalState.commandArgs;
        if (!commandArgs) return;

        const commandBlueprint: Command.Blueprint = blueprint[commandArgs.baseCommand];
        if (!commandBlueprint) return;

        const commandEntrypoint = commandBlueprint.entrypoint;
        const _pipelineBlueprint = commandBlueprint.pipeline;
        if (!commandEntrypoint || !_pipelineBlueprint) return;

        const startTaskId = commandEntrypoint;

        setPipelineContext({
            currentTaskId: startTaskId,
            pipelineData: {},
            commandArgs,
            hooks,
        });
        setPipelineBlueprint(_pipelineBlueprint);
    }, [terminalState.commandArgs]);

    useEffect(() => {
        if (!currentTaskId || !pipelineBlueprint) return;

        const task = pipelineBlueprint[currentTaskId];
        setCurrentTask(task);
    }, [currentTaskId, pipelineBlueprint]);

    useEffect(() => {
        if (isProcessing.current || !currentTask) return;

        switch (currentTask.type) {
            case 'action':
                handleActionTask();
                break;
            default:
                break;
        }
    }, [currentTask, isProcessing]);

    const handlePromptResponse = (data: any) => {
        if (!pipelineContext) return;
        if (!currentTask || currentTask.type !== 'prompt') return;

        finishTask({ pipelineContext, currentTask, data });
    };

    const handleActionTask = async () => {
        if (!pipelineContext) return;
        if (!currentTask || currentTask.type !== 'action') return;

        try {
            isProcessing.current = true;

            const data = await currentTask.actionFunction(pipelineContext);

            finishTask({ pipelineContext, currentTask, data });
        } catch (error) {
            handleError(error);
        } finally {
            isProcessing.current = false;
        }
    };

    const finishTask = ({
        pipelineContext,
        currentTask,
        data,
    }: {
        pipelineContext: Pipeline.Context;
        currentTask: Task.Task;
        data: any;
    }) => {
        const { currentTaskId } = pipelineContext;
        if (!currentTaskId) return;

        const newPipelineContext: Pipeline.Context = {
            ...pipelineContext,
            pipelineData: { ...pipelineContext.pipelineData, [currentTaskId]: data },
        };

        const { next } = currentTask;
        const nextTaskId = typeof next === 'function' ? next(newPipelineContext) : next;

        if (!nextTaskId) {
            endPipelineAndSetIdle();
            return;
        }

        setPipelineContext({
            ...newPipelineContext,
            currentTaskId: nextTaskId,
        });
        setTaskBreadcrumbs((prev) => [...prev, currentTaskId]);
    };

    const goToPreviousTask = () => {
        if (!pipelineContext) return;

        const previousTaskId = taskBreadcrumbs[taskBreadcrumbs.length - 1];
        if (!previousTaskId) {
            endPipelineAndSetIdle();
            return;
        }

        // Removes the previous task entry from `pipelineContext.pipelineData`
        const newPipelineData: Pipeline.PipelineData = Object.fromEntries(
            Object.entries(pipelineContext.pipelineData).filter(([key]) => key !== previousTaskId)
        );

        setPipelineContext((prev) => {
            if (!prev) return prev;
            return { ...prev, pipelineData: newPipelineData, currentTaskId: previousTaskId };
        });
        setTaskBreadcrumbs((prev) => prev.slice(0, -1));
    };

    const handleError = (error: any) => {
        console.error('Erro no Terminal:', error?.message ?? 'ERROR');
        hooks.historyLog.logError(error);
        endPipelineAndSetIdle();
    };

    const endPipelineAndSetIdle = () => {
        terminalDispatch({ type: 'SET_IDLE_CONSOLE' });
    };

    return {
        pipelineContext,
        pipelineBlueprint,
        handlePromptResponse,
        goToPreviousTask,
        isProcessing,
    };
};

export default usePipeline;

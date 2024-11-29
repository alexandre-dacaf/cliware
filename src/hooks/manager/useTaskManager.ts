import { TerminalContext } from 'context/TerminalContext';
import useAppDispatcher from 'hooks/app/useAppDispatcher';
import useClipboard from 'hooks/context/useClipboard';
import useFileDownloader from 'hooks/context/useFileDownloader';
import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useContext, useEffect, useState } from 'react';
import { Command, Pipeline, Task } from 'types';

const useTaskManager = () => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const [currentPipelineContext, setCurrentPipelineContext] = useState<Pipeline.Context | null>(
        null
    );
    const messagePanel = useMessagePanel();
    const history = useHistoryLogger();
    const clipboard = useClipboard();
    const fileDownload = useFileDownloader();
    const appDispatcher = useAppDispatcher();

    useEffect(() => {
        const initiatePipeline = async () => {
            const command = terminalState.command;

            if (!command) return;

            const commandEntrypoint = command.entrypoint;
            const commandPipeline = command.pipeline;

            if (!commandEntrypoint || !commandPipeline) return;

            const startTaskKey = commandEntrypoint;

            const pipelineContext = generatePipelineContext(startTaskKey, command);
            await startTask(pipelineContext);
        };

        initiatePipeline();
    }, [terminalState.command]);

    const generatePipelineContext = (
        taskKey: Task.TaskKey,
        command: Command.Blueprint
    ): Pipeline.Context => {
        return {
            currentTaskKey: taskKey,
            taskBreadcrumbs: [],
            pipelineData: {},
            pipelineBlueprint: command.pipeline,
            commandArgs: terminalState.commandArgs,
            messagePanel,
            history,
            clipboard,
            fileDownload,
            appDispatcher,
        };
    };

    const startTask = async (pipelineContext: Pipeline.Context) => {
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipelineBlueprint[currentTaskKey];

        if (!currentTask) return;

        switch (currentTask.type) {
            case 'action':
                await handleActionTask(pipelineContext);
                break;
            case 'prompt':
                await savePipelineContextForLater(pipelineContext);
                break;
        }
    };

    const handleActionTask = async (pipelineContext: Pipeline.Context) => {
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipelineBlueprint[currentTaskKey];

        if (!currentTask || currentTask.type !== 'action') return;

        try {
            const pipelineData = pipelineContext.pipelineData;
            const response = await currentTask.actionFunction(pipelineContext);

            const newPipelineContext = {
                ...pipelineContext,
                pipelineData: { ...pipelineData, [currentTaskKey]: response },
            };

            finishTask(newPipelineContext);
        } catch (error) {
            handleError(error);
        }
    };

    const savePipelineContextForLater = async (pipelineContext: Pipeline.Context) => {
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipelineBlueprint[currentTaskKey];

        if (!currentTask || currentTask.type !== 'prompt') return;

        setCurrentPipelineContext(pipelineContext);
    };

    const handlePromptResponse = (response: any) => {
        if (!currentPipelineContext) {
            endPipelineAndStandby();
            return;
        }

        const pipelineData = currentPipelineContext.pipelineData;
        const currentTaskKey = currentPipelineContext.currentTaskKey;

        const newPipelineContext = {
            ...currentPipelineContext,
            pipelineData: { ...pipelineData, [currentTaskKey]: response },
        };
        setCurrentPipelineContext(null);
        finishTask(newPipelineContext);
    };

    const handlePromptGoBack = () => {
        if (!currentPipelineContext) {
            endPipelineAndStandby();
            return;
        }

        const breadcrumbs = currentPipelineContext.taskBreadcrumbs;
        const previousTaskKey = breadcrumbs[breadcrumbs.length - 1];

        if (!previousTaskKey) {
            endPipelineAndStandby();
            return;
        }

        // Removes the previous task entry from `currentPipelineContext.pipelineData`
        const newPipelineData = Object.fromEntries(
            Object.entries(currentPipelineContext.pipelineData).filter(
                ([key]) => key !== previousTaskKey
            )
        );

        currentPipelineContext.history.printPromptResponse('Returning to the previous prompt...');

        const newPipelineContext: Pipeline.Context = {
            ...currentPipelineContext,
            pipelineData: newPipelineData,
            currentTaskKey: previousTaskKey,
            taskBreadcrumbs: breadcrumbs.slice(0, -1),
        };

        setCurrentPipelineContext(null);
        startTask(newPipelineContext);
    };

    const finishTask = (pipelineContext: Pipeline.Context) => {
        const currentTaskKey = pipelineContext.currentTaskKey;
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const next = pipelineBlueprint[currentTaskKey].next;

        if (!next) {
            endPipelineAndStandby();
            return;
        }

        const nextTaskKey: Task.TaskKey = typeof next === 'function' ? next(pipelineContext) : next;

        if (!(nextTaskKey in pipelineBlueprint)) {
            handleError(`${nextTaskKey} not in pipeline. Check blueprint keys.`);
        }

        const breadcrumbs = pipelineContext.taskBreadcrumbs;

        const newPipelineContext: Pipeline.Context = {
            ...pipelineContext,
            currentTaskKey: nextTaskKey,
            taskBreadcrumbs: [...breadcrumbs, currentTaskKey],
        };

        startTask(newPipelineContext);
    };

    const handleError = (error: any) => {
        history.printError(error);
        endPipelineAndStandby();
    };

    const endPipelineAndStandby = () => {
        terminalDispatch({ type: 'SET_IDLE_CONSOLE' });
    };

    return {
        terminalState,
        currentPipelineContext,
        handlePromptResponse,
        handlePromptGoBack,
    };
};

export default useTaskManager;

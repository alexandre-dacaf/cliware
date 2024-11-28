import { useState, useEffect, useContext } from 'react';
import { PipelineContext, Blueprint } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import usePrinter from 'hooks/printer/usePrinter';
import useAppDispatcher from 'hooks/app/useAppDispatcher';

const useTaskManager = () => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const [currentPipelineContext, setCurrentPipelineContext] =
        useState<PipelineContext.PipelineContext | null>(null);
    const printer = usePrinter();
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
        taskKey: Blueprint.TaskKey,
        command: Blueprint.Command
    ): PipelineContext.PipelineContext => {
        return {
            currentTaskKey: taskKey,
            taskBreadcrumbs: [],
            pipelineData: {},
            pipeline: command.pipeline,
            commandArgs: terminalState.commandArgs,
            printer,
            appDispatcher,
        };
    };

    const startTask = async (pipelineContext: PipelineContext.PipelineContext) => {
        const pipeline = pipelineContext.pipeline;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipeline[currentTaskKey];

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

    const handleActionTask = async (pipelineContext: PipelineContext.PipelineContext) => {
        const pipeline = pipelineContext.pipeline;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipeline[currentTaskKey];

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

    const savePipelineContextForLater = async (
        pipelineContext: PipelineContext.PipelineContext
    ) => {
        const pipeline = pipelineContext.pipeline;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipeline[currentTaskKey];

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

        currentPipelineContext.printer.printPromptResponse('Returning to the previous prompt...');

        const newPipelineContext: PipelineContext.PipelineContext = {
            ...currentPipelineContext,
            pipelineData: newPipelineData,
            currentTaskKey: previousTaskKey,
            taskBreadcrumbs: breadcrumbs.slice(0, -1),
        };

        setCurrentPipelineContext(null);
        startTask(newPipelineContext);
    };

    const finishTask = (pipelineContext: PipelineContext.PipelineContext) => {
        const currentTaskKey = pipelineContext.currentTaskKey;
        const pipeline = pipelineContext.pipeline;
        const next = pipeline[currentTaskKey].next;

        if (!next) {
            endPipelineAndStandby();
            return;
        }

        const nextTaskKey: Blueprint.TaskKey =
            typeof next === 'function' ? next(pipelineContext) : next;

        if (!(nextTaskKey in pipeline)) {
            handleError(`${nextTaskKey} not in pipeline. Check blueprint keys.`);
        }

        const breadcrumbs = pipelineContext.taskBreadcrumbs;

        const newPipelineContext: PipelineContext.PipelineContext = {
            ...pipelineContext,
            currentTaskKey: nextTaskKey,
            taskBreadcrumbs: [...breadcrumbs, currentTaskKey],
        };

        startTask(newPipelineContext);
    };

    const handleError = (error: any) => {
        printer.printError(error);
        endPipelineAndStandby();
    };

    const endPipelineAndStandby = () => {
        terminalDispatch({ type: 'STANDBY' });
    };

    return {
        terminalState,
        currentPipelineContext,
        handlePromptResponse,
        handlePromptGoBack,
    };
};

export default useTaskManager;

import { useState, useEffect, useContext } from 'react';
import { PipelineContext, TaskKey, CommandBlueprint } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import usePrinter from 'hooks/printer/usePrinter';
import useAppDispatcher from 'hooks/app/useAppDispatcher';

const useTaskManager = () => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const [currentPipelineContext, setCurrentPipelineContext] = useState<PipelineContext | null>(
        null
    );
    const printer = usePrinter();
    const appDispatcher = useAppDispatcher();

    useEffect(() => {
        const initiatePipeline = async () => {
            const commandBlueprint = terminalState.commandBlueprint;

            if (!commandBlueprint) return;

            const commandEntrypoint = commandBlueprint.entrypoint;
            const commandPipeline = commandBlueprint.pipeline;

            if (!commandEntrypoint || !commandPipeline) return;

            const startTaskKey = commandEntrypoint;

            const pipelineContext = generatePipelineContext(startTaskKey, commandBlueprint);
            await startTask(pipelineContext);
        };

        initiatePipeline();
    }, [terminalState.commandBlueprint]);

    const generatePipelineContext = (
        taskKey: TaskKey,
        commandBlueprint: CommandBlueprint
    ): PipelineContext => {
        return {
            currentTaskKey: taskKey,
            taskKeyBreadcrumbs: [],
            pipelineData: {},
            pipelineBlueprint: commandBlueprint.pipeline,
            commandArgs: terminalState.commandArgs,
            printer,
            appDispatcher,
        };
    };

    const startTask = async (pipelineContext: PipelineContext) => {
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

    const handleActionTask = async (pipelineContext: PipelineContext) => {
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

    const savePipelineContextForLater = async (pipelineContext: PipelineContext) => {
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

        const breadcrumbs = currentPipelineContext.taskKeyBreadcrumbs;
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

        currentPipelineContext.printer.printInput('Returning to the previous prompt...');

        const newPipelineContext: PipelineContext = {
            ...currentPipelineContext,
            pipelineData: newPipelineData,
            currentTaskKey: previousTaskKey,
            taskKeyBreadcrumbs: breadcrumbs.slice(0, -1),
        };

        setCurrentPipelineContext(null);
        startTask(newPipelineContext);
    };

    const finishTask = (pipelineContext: PipelineContext) => {
        const currentTaskKey = pipelineContext.currentTaskKey;
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const next = pipelineBlueprint[currentTaskKey].next;

        if (!next) {
            endPipelineAndStandby();
            return;
        }

        const nextTaskKey: TaskKey = typeof next === 'function' ? next(pipelineContext) : next;

        if (!(nextTaskKey in pipelineBlueprint)) {
            handleError(`${nextTaskKey} not in pipeline. Check blueprint keys.`);
        }

        const breadcrumbs = pipelineContext.taskKeyBreadcrumbs;

        const newPipelineContext: PipelineContext = {
            ...pipelineContext,
            currentTaskKey: nextTaskKey,
            taskKeyBreadcrumbs: [...breadcrumbs, currentTaskKey],
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

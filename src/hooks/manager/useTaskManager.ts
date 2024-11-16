import { useState, useEffect, useContext } from 'react';
import { PipelineData, PipelineContext, TaskKey, NextTask, CommandBlueprint } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { AppContext } from 'context/AppContext';
import usePrinter from 'hooks/printer/usePrinter';
import useAppDispatcher from 'hooks/app/useAppDispatcher';

const useTaskManager = () => {
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);
    const [currentPipelineContext, setCurrentPipelineContext] = useState<PipelineContext | null>(null);
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

    const generatePipelineContext = (taskKey: TaskKey, commandBlueprint: CommandBlueprint) => {
        const startPipelineData = Object.keys(commandBlueprint.pipeline).reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {} as PipelineData);

        return {
            currentTaskKey: taskKey,
            pipelineData: startPipelineData,
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
                await savePipelineContextForPromptResponse(pipelineContext);
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

            const newPipelineContext = { ...pipelineContext, pipelineData: { ...pipelineData, [currentTaskKey]: response } };

            finishTask(newPipelineContext);
        } catch (error) {
            handleError(error);
        }
    };

    const savePipelineContextForPromptResponse = async (pipelineContext: PipelineContext) => {
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const currentTaskKey = pipelineContext.currentTaskKey;
        const currentTask = pipelineBlueprint[currentTaskKey];

        if (!currentTask || currentTask.type !== 'prompt') return;

        setCurrentPipelineContext(pipelineContext);
    };

    const handlePromptResponse = (response: any) => {
        if (currentPipelineContext === null) return;

        const pipelineContext = currentPipelineContext;

        if (!pipelineContext) {
            endPipelineAndStandby();
            return;
        }

        const pipelineData = pipelineContext.pipelineData;
        const currentTaskKey = pipelineContext.currentTaskKey;

        const newPipelineContext = { ...pipelineContext, pipelineData: { ...pipelineData, [currentTaskKey]: response } };
        setCurrentPipelineContext(null);
        finishTask(newPipelineContext);
    };

    const finishTask = (pipelineContext: PipelineContext) => {
        const currentTaskKey = pipelineContext.currentTaskKey;
        const pipelineBlueprint = pipelineContext.pipelineBlueprint;
        const next = pipelineBlueprint[currentTaskKey].next;

        if (!next) {
            endPipelineAndStandby();
            return;
        }

        let nextTaskKey: NextTask;
        if (typeof next === 'function') {
            nextTaskKey = next(pipelineContext);
        } else {
            nextTaskKey = next;
        }

        if (!(nextTaskKey in pipelineBlueprint)) {
            handleError(`${nextTaskKey} not in pipeline. Check blueprint keys.`);
        }

        const newPipelineContext = { ...pipelineContext, currentTaskKey: nextTaskKey };

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
    };
};

export default useTaskManager;

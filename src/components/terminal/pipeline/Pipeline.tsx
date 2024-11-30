import usePipeline from 'hooks/pipeline/usePipeline';
import React from 'react';
import PromptFactory from './factory/PromptFactory';

interface PipelineProps {
    isActive: boolean;
}

const Pipeline: React.FC<PipelineProps> = ({ isActive }) => {
    const {
        pipelineContext,
        pipelineBlueprint,
        handlePromptResponse,
        goToPreviousTask,
        isProcessing,
    } = usePipeline();

    const renderCurrentTask = () => {
        if (isProcessing.current) return null;
        if (!pipelineContext || !pipelineBlueprint || !pipelineContext.currentTaskId) return null;

        const currentTaskId = pipelineContext.currentTaskId;
        const currentTask = pipelineBlueprint[currentTaskId];

        if (!currentTask || currentTask.type !== 'prompt') return null;

        return (
            <PromptFactory
                taskId={currentTaskId}
                task={currentTask}
                pipelineContext={pipelineContext}
                onSubmit={handlePromptResponse}
                onGoBack={goToPreviousTask}
                isActive={isActive}
            />
        );
    };

    return renderCurrentTask();
};

export default Pipeline;

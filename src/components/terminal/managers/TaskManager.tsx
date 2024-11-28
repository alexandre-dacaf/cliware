import React from 'react';
import { PromptHandler } from './handlers/PromptHandler';
import useTaskManager from 'hooks/manager/useTaskManager';

interface TaskManagerProps {
    isActive: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isActive }) => {
    const { currentPipelineContext, handlePromptResponse, handlePromptGoBack } = useTaskManager();

    const renderCurrentTask = () => {
        if (!currentPipelineContext) return null;

        const pipeline = currentPipelineContext.pipeline;
        const currentTaskKey = currentPipelineContext.currentTaskKey;
        const currentTask = pipeline[currentTaskKey];

        if (!currentTask || currentTask.type !== 'prompt') return null;

        return (
            <PromptHandler
                task={currentTask}
                onSubmit={handlePromptResponse}
                onGoBack={handlePromptGoBack}
                isActive={isActive}
            />
        );
    };

    return renderCurrentTask();
};

export default TaskManager;

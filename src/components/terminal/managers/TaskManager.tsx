import React from 'react';
import { PromptHandler } from './handlers/PromptHandler';
import useTaskManager from 'hooks/manager/useTaskManager';

interface TaskManagerProps {
    isActive: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isActive }) => {
    const { terminalState, currentPipelineContext, handlePromptResponse } = useTaskManager();

    const renderCurrentTask = () => {
        if (!currentPipelineContext) return null;

        const pipelineBlueprint = currentPipelineContext.pipelineBlueprint;
        const currentTaskKey = currentPipelineContext.currentTaskKey;
        const currentTask = pipelineBlueprint[currentTaskKey];

        if (!currentTask || currentTask.type !== 'prompt') return null;

        return <PromptHandler task={currentTask} onSubmit={handlePromptResponse} isActive={isActive} />;
        // switch (currentTask.type) {
        //     case 'prompt':
        //     case 'action':
        //         // 'action' tasks are not rendered directly
        //         return null;
        //     default:
        //         return <p>Task type unknown!</p>;
        // }
    };

    return renderCurrentTask();
};

export default TaskManager;

import React from 'react';
import { PromptHandler } from './handlers/PromptHandler';
import useTaskManager from 'hooks/manager/useTaskManager';

interface TaskManagerProps {
    isActive: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isActive }) => {
    const { state, currentTaskKey, currentTask, taskStream, handlePromptResponse } = useTaskManager();

    const renderCurrentTask = () => {
        if (!state.commandBlueprint) {
            return null;
        }

        if (!currentTaskKey || !currentTask) {
            return null;
        }

        switch (currentTask.type) {
            case 'prompt':
                return <PromptHandler task={currentTask} taskStream={taskStream} onNext={handlePromptResponse} isActive={isActive} />;
            case 'action':
                // 'action' tasks are not rendered directly
                return null;
            default:
                return <p>Task type unknown!</p>;
        }
    };

    return renderCurrentTask();
};

export default TaskManager;

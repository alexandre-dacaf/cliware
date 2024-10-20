import React, { useEffect } from 'react';
import { PromptTask, PipelineData } from '../../types';
import { TextPrompt, ConfirmPrompt, SelectPrompt, NumberPrompt } from '.';
import './PromptManager.css';

interface PromptManagerProps {
    task: PromptTask;
    pipelineData: PipelineData;
    onNext: (response: any) => void;
    isActive: boolean;
}

const PromptManager: React.FC<PromptManagerProps> = ({ task, pipelineData, onNext, isActive }) => {
    useEffect(() => {
        // If the task has logic to pre-populate the response based on pipelineData, implement it here
        // For example, if you are editing and already have a value
    }, [pipelineData]);

    const handleResponse = (resp: any) => {
        onNext(resp);
    };

    const renderPrompt = () => {
        switch (task.promptType) {
            case 'text':
                return (
                    <TextPrompt
                        message={task.message}
                        onSubmit={handleResponse}
                        isActive={isActive}
                    />
                );
            case 'confirm':
                return (
                    <ConfirmPrompt
                        message={task.message}
                        choiceTrueLabel={task.trueLabel}
                        choiceFalseLabel={task.falseLabel}
                        onSubmit={handleResponse}
                        isActive={isActive}
                    />
                );
            case 'select':
                return (
                    <SelectPrompt
                        message={task.message}
                        onSubmit={handleResponse}
                        choices={task.choices}
                        isActive={isActive}
                    />
                );
            case 'number':
                return (
                    <NumberPrompt
                        message={task.message}
                        max={task.max}
                        min={task.min}
                        step={task.step}
                        float={task.float}
                        decimals={task.decimals}
                        onSubmit={handleResponse}
                        isActive={isActive}
                    />
                );
            default:
                return <p>Prompt type unknown!</p>;
        }
    };

    return <div className='prompt-component'>{renderPrompt()}</div>;
};

PromptManager.displayName = 'PromptManager';

export { PromptManager };

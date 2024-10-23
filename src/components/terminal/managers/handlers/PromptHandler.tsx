import React, { useContext } from 'react';
import { PromptTask, TaskStream } from 'types';
import { TextPrompt, ConfirmPrompt, SelectPrompt, NumberPrompt, ListPrompt, DatePrompt, AutoCompletePrompt, PasswordPrompt } from 'components/prompts';
import { AppContext } from 'context/AppContext';
import './PromptHandler.css';

interface PromptHandlerProps {
    task: PromptTask;
    taskStream: TaskStream;
    onNext: (data: any, textResponse: string) => void;
    isActive: boolean;
}

const PromptHandler: React.FC<PromptHandlerProps> = ({ task, taskStream, onNext, isActive }) => {
    const { dispatch } = useContext(AppContext);

    const handleResponse = (data: any, textResponse: string) => {
        onNext(data, textResponse);
    };

    const deactivateTerminal = () => {
        if (isActive) {
            dispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

    const renderPrompt = () => {
        switch (task.promptType) {
            case 'text':
                return <TextPrompt message={task.message} onSubmit={handleResponse} isActive={isActive} onEscape={deactivateTerminal} />;
            case 'confirm':
                return (
                    <ConfirmPrompt
                        message={task.message}
                        choiceTrueLabel={task.trueLabel}
                        choiceFalseLabel={task.falseLabel}
                        onSubmit={handleResponse}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'select':
                return (
                    <SelectPrompt
                        message={task.message}
                        onSubmit={handleResponse}
                        choices={task.choices}
                        multiselect={false}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'multiselect':
                return (
                    <SelectPrompt
                        message={task.message}
                        onSubmit={handleResponse}
                        choices={task.choices}
                        multiselect={true}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
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
                        onEscape={deactivateTerminal}
                    />
                );
            case 'list':
                return (
                    <ListPrompt message={task.message} separator={task.separator} onSubmit={handleResponse} isActive={isActive} onEscape={deactivateTerminal} />
                );
            case 'date':
                return <DatePrompt message={task.message} onSubmit={handleResponse} isActive={isActive} onEscape={deactivateTerminal} />;
            case 'autocomplete':
                return (
                    <AutoCompletePrompt
                        message={task.message}
                        onSubmit={handleResponse}
                        choices={task.choices}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'password':
                return <PasswordPrompt message={task.message} onSubmit={handleResponse} isActive={isActive} onEscape={deactivateTerminal} />;
            default:
                return <p>Prompt type unknown!</p>;
        }
    };

    return <div className="prompt-component">{renderPrompt()}</div>;
};

PromptHandler.displayName = 'PromptHandler';

export { PromptHandler };

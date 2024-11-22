import React, { useContext } from 'react';
import { PromptTask } from 'types';
import {
    TextPrompt,
    TogglePrompt,
    SelectPrompt,
    NumberPrompt,
    ListPrompt,
    DatePrompt,
    AutoCompletePrompt,
    PasswordPrompt,
} from 'components/prompts';
import { AppContext } from 'context/AppContext';
import './PromptHandler.css';

interface PromptHandlerProps {
    task: PromptTask;
    onSubmit: (data: any) => void;
    isActive: boolean;
}

const PromptHandler: React.FC<PromptHandlerProps> = ({ task, onSubmit: onSubmit, isActive }) => {
    const { dispatch } = useContext(AppContext);

    const handleSubmit = (data: any) => {
        onSubmit(data);
    };

    const deactivateTerminal = () => {
        if (isActive) {
            dispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

    const renderPrompt = () => {
        switch (task.promptType) {
            case 'text':
                return (
                    <TextPrompt
                        message={task.message}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'toggle':
                return (
                    <TogglePrompt
                        message={task.message}
                        trueLabel={task.trueLabel}
                        falseLabel={task.falseLabel}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'select':
                return (
                    <SelectPrompt
                        message={task.message}
                        onSubmit={handleSubmit}
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
                        onSubmit={handleSubmit}
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
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'list':
                return (
                    <ListPrompt
                        message={task.message}
                        separator={task.separator}
                        trim={task.trim}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'date':
                return (
                    <DatePrompt
                        message={task.message}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'autocomplete':
                return (
                    <AutoCompletePrompt
                        message={task.message}
                        onSubmit={handleSubmit}
                        suggestions={task.suggestions}
                        itemsPerPage={task.itemsPerPage}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            case 'password':
                return (
                    <PasswordPrompt
                        message={task.message}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                    />
                );
            default:
                return <p>Prompt type unknown!</p>;
        }
    };

    return <div className='prompt-component'>{renderPrompt()}</div>;
};

PromptHandler.displayName = 'PromptHandler';

export { PromptHandler };

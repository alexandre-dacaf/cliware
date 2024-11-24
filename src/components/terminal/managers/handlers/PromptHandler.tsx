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
import { TerminalContext } from 'context/TerminalContext';
import './PromptHandler.css';

interface PromptHandlerProps {
    task: PromptTask;
    onSubmit: (data: any) => void;
    isActive: boolean;
}

const PromptHandler: React.FC<PromptHandlerProps> = ({ task, onSubmit: onSubmit, isActive }) => {
    const { dispatch: appDispatch } = useContext(AppContext);
    const { dispatch: terminalDispatch } = useContext(TerminalContext);

    const handleSubmit = (data: any) => {
        onSubmit(data);
    };

    const deactivateTerminal = () => {
        if (isActive) {
            appDispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

    const endPipelineAndStandby = () => {
        if (isActive) {
            terminalDispatch({ type: 'STANDBY' });
        }
    };

    const renderPrompt = () => {
        switch (task.promptType) {
            case 'text':
                return (
                    <TextPrompt
                        message={task.message}
                        defaultValue={task.default}
                        required={task.required}
                        trim={task.trim}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'toggle':
                return (
                    <TogglePrompt
                        message={task.message}
                        trueLabel={task.trueLabel}
                        falseLabel={task.falseLabel}
                        defaultValue={task.default}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'select':
                return (
                    <SelectPrompt
                        message={task.message}
                        choices={task.choices}
                        defaultValue={task.default}
                        onSubmit={handleSubmit}
                        multiselect={false}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'multiselect':
                return (
                    <SelectPrompt
                        message={task.message}
                        choices={task.choices}
                        defaultValue={task.default}
                        required={task.required}
                        onSubmit={handleSubmit}
                        multiselect={true}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
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
                        defaultValue={task.default}
                        required={task.required}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'list':
                return (
                    <ListPrompt
                        message={task.message}
                        separator={task.separator}
                        trim={task.trim}
                        required={task.required}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'date':
                return (
                    <DatePrompt
                        message={task.message}
                        defaultValue={task.default}
                        required={task.required}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'autocomplete':
                return (
                    <AutoCompletePrompt
                        message={task.message}
                        suggestions={task.suggestions}
                        itemsPerPage={task.itemsPerPage}
                        defaultValue={task.default}
                        required={task.required}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
                    />
                );
            case 'password':
                return (
                    <PasswordPrompt
                        message={task.message}
                        required={task.required}
                        placeholder={task.placeholder}
                        onSubmit={handleSubmit}
                        isActive={isActive}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndStandby}
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

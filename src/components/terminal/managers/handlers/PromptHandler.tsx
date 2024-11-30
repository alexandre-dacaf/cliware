import {
    AutoCompletePrompt,
    DatePrompt,
    ListPrompt,
    NumberPrompt,
    PasswordPrompt,
    SelectPrompt,
    TextPrompt,
    TogglePrompt,
} from 'components/prompts';
import { AppContext } from 'context/AppContext';
import { TerminalContext } from 'context/TerminalContext';
import React, { useContext } from 'react';
import { Pipeline, Prompt } from 'types';
import './PromptHandler.scss';

interface PromptHandlerProps {
    task: Prompt.PromptTask;
    pipelineContext: Pipeline.Context;
    onSubmit: (data: any) => void;
    onGoBack: () => void;
    isActive: boolean;
}

const PromptHandler: React.FC<PromptHandlerProps> = ({
    task,
    pipelineContext,
    onSubmit: onSubmit,
    isActive,
    onGoBack,
}) => {
    const { dispatch: appDispatch } = useContext(AppContext);
    const { dispatch: terminalDispatch } = useContext(TerminalContext);

    const handleSubmit = (data: any) => {
        onSubmit(data);
    };

    const handleGoBack = () => {
        onGoBack();
    };

    const deactivateTerminal = () => {
        if (isActive) {
            appDispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

    const endPipelineAndSetIdle = () => {
        if (isActive) {
            terminalDispatch({ type: 'SET_IDLE_CONSOLE' });
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
                        validate={task.validate}
                        mask={task.mask}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                    />
                );
            case 'toggle':
                return (
                    <TogglePrompt
                        message={task.message}
                        trueLabel={task.trueLabel}
                        falseLabel={task.falseLabel}
                        defaultValue={task.default}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                    />
                );
            case 'select':
                return (
                    <SelectPrompt
                        multiselect={false}
                        message={task.message}
                        choices={task.choices}
                        defaultValue={task.default}
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                        pipelineContext={pipelineContext}
                    />
                );
            case 'multiselect':
                return (
                    <SelectPrompt
                        multiselect={true}
                        message={task.message}
                        choices={task.choices}
                        defaultValue={task.default}
                        required={task.required}
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                        pipelineContext={pipelineContext}
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
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
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
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                    />
                );
            case 'date':
                return (
                    <DatePrompt
                        message={task.message}
                        defaultValue={task.default}
                        required={task.required}
                        placeholder={task.placeholder}
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
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
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
                    />
                );
            case 'password':
                return (
                    <PasswordPrompt
                        message={task.message}
                        required={task.required}
                        placeholder={task.placeholder}
                        validate={task.validate}
                        isActive={isActive}
                        onSubmit={handleSubmit}
                        onEscape={deactivateTerminal}
                        onAbort={endPipelineAndSetIdle}
                        onGoBack={handleGoBack}
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

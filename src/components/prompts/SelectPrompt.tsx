import { Checkbox } from 'components/widgets/Checkbox';
import { Radio } from 'components/widgets/Radio';
import useSelectPrompt from 'hooks/prompts/useSelectPrompt';
import React, { useEffect, useRef } from 'react';
import { Pipeline, Prompt } from 'types';
import './SelectPrompt.scss';

interface SelectPromptProps {
    message: string;
    choices: Prompt.Choice[] | Prompt.ChoiceFunction;
    multiselect: boolean;
    defaultValue?: any;
    required?: boolean;
    isActive: boolean;
    validate?: Prompt.ValidateFunction;
    onSubmit: (data: Prompt.Choice[] | Prompt.Choice) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
    pipelineContext: Pipeline.Context;
}

const SelectPrompt: React.FC<SelectPromptProps> = ({
    message,
    choices,
    multiselect = false,
    defaultValue,
    required = false,
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
    pipelineContext,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { formattedChoices, selectedIndex, checkedIndexes, handleKeyDown } = useSelectPrompt({
        message,
        choices,
        multiselect,
        defaultValue,
        required,
        validate,
        onSubmit,
        onEscape,
        onAbort,
        onGoBack,
        pipelineContext,
    });

    useEffect(() => {
        if (isActive && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (
            containerRef.current &&
            relatedTarget &&
            !containerRef.current.contains(relatedTarget)
        ) {
            // Focus completelly left containerRef
            containerRef.current.focus();
        }
    };

    const renderMessage = () => {
        if (formattedChoices.length === 0) return null;

        return <div className='select-message'>{message}</div>;
    };

    const renderSelectPrompt = () => {
        if (formattedChoices.length === 0) return null;

        return (
            <div className='choices-list'>
                {formattedChoices.map((choice, index) => {
                    const isSelected = selectedIndex === index;
                    const isChecked = checkedIndexes.includes(index);

                    if (!multiselect) {
                        return (
                            <Radio
                                key={index}
                                isSelected={isSelected}
                                label={choice.label}
                                hint={choice.hint}
                            />
                        );
                    }

                    return (
                        <Checkbox
                            key={index}
                            isSelected={isSelected}
                            isChecked={isChecked}
                            label={choice.label}
                            hint={choice.hint}
                        />
                    );
                })}
            </div>
        );
    };

    const renderNavigationTip = () => {
        if (formattedChoices.length === 0) return null;

        return (
            <span className='select-navigation-tip'>
                <em>Use arrow keys to navigate, Space to (de)select and Enter to confirm.</em>
            </span>
        );
    };

    return (
        <div
            ref={containerRef}
            className='select-prompt'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            {renderMessage()}
            {renderNavigationTip()}
            {renderSelectPrompt()}
        </div>
    );
};

SelectPrompt.displayName = 'SelectPrompt';

export { SelectPrompt };

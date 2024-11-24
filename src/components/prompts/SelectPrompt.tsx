import React, { useRef, useEffect } from 'react';
import useSelectPrompt from 'hooks/prompts/useSelectPrompt';
import { Choice } from 'types';
import './SelectPrompt.css';

export type SelectPromptProps = {
    message: string;
    choices: Choice[];
    multiselect: boolean;
    defaultValue?: any;
    required?: boolean;
    onSubmit: (data: Choice[] | Choice) => void;
    isActive: boolean;
    onEscape: () => void;
    onAbort: () => void;
};

const SelectPrompt: React.FC<SelectPromptProps> = ({
    message,
    choices,
    multiselect = false,
    defaultValue,
    required = false,
    onSubmit,
    isActive,
    onEscape,
    onAbort,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { selectedIndex, checkedIndexes, handleKeyDown } = useSelectPrompt({
        message,
        choices,
        multiselect,
        defaultValue,
        required,
        onSubmit,
        onEscape,
        onAbort,
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

    return (
        <div
            ref={containerRef}
            className='select-prompt'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <div className='select-message'>{message}</div>
            <div className='choices-list'>
                {choices.map((choice, index) => (
                    <div className='choice' key={index}>
                        <span
                            className={`choice-label ${selectedIndex === index ? 'selected' : ''} ${
                                checkedIndexes.includes(index) ? 'checked' : ''
                            }`}
                        >
                            {choice.label}
                        </span>
                        {choice.hint ? (
                            <span
                                className={`choice-hint ${
                                    selectedIndex === index ? 'selected' : ''
                                }`}
                            >
                                {choice.hint}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
            <span className='select-navigation-hint'>
                <em>Use arrow keys to navigate, Space to (de)select and Enter to confirm.</em>
            </span>
        </div>
    );
};

SelectPrompt.displayName = 'SelectPrompt';

export { SelectPrompt };

import React, { useMemo, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import useAutoCompletePrompt from 'hooks/prompts/useAutoCompletePrompt';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import { Choice } from 'types';
import './AutoCompletePrompt.css';

export type AutoCompletePromptProps = {
    message: string;
    choices: Choice[];
    itemsPerPage?: number;
    onSubmit: (data: Choice) => void;
    isActive: boolean;
    onEscape: () => void;
};

const AutoCompletePrompt: React.FC<AutoCompletePromptProps> = ({
    message,
    choices,
    itemsPerPage = 10,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const formattedChoices = useMemo(
        () =>
            choices.map((choice) => ({
                ...choice,
                value: choice.value ?? choice.label,
            })),
        [choices]
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const {
        value,
        setValue,
        pageChoices,
        pageIndex,
        handleChange,
        selectPrevious,
        selectNext,
        nextPage,
        prevPage,
        currentPage,
        totalPages,
    } = useAutoCompletePrompt(formattedChoices, itemsPerPage);
    const { submit } = usePromptSubmitter(message, onSubmit);

    const handleEnter = () => {
        const clear = () => {
            setValue('');
        };

        submit({ data: pageChoices[pageIndex], clear });
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;

        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (key === 'ArrowDown') {
            selectNext();
        }
        if (key === 'ArrowUp') {
            selectPrevious();
        }
        if (key === 'Enter') {
            handleEnter();
        }
        if (key === 'Escape') {
            onEscape();
        }
        if (key === 'PageDown') {
            nextPage();
        }
        if (key === 'PageUp') {
            prevPage();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape', 'PageDown', 'PageUp'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className='autocomplete-prompt'>
            <div>
                <span className='autocomplete-message'>{message}</span>
                <input
                    ref={inputRef}
                    className='autocomplete-field'
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            </div>

            <div className='autocomplete-choices'>
                {pageChoices.map((choice, index) => (
                    <span
                        key={index}
                        className={`autocomplete-choice ${pageIndex === index ? 'selected' : ''}`}
                    >
                        {choice.label}
                    </span>
                ))}
                {choices.length > itemsPerPage ? (
                    <em className='autocomplete-pages'>
                        Page {currentPage + 1}/{totalPages}
                    </em>
                ) : null}
            </div>
        </div>
    );
};

AutoCompletePrompt.displayName = 'AutoCompletePrompt';

export { AutoCompletePrompt };

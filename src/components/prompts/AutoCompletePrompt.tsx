import React, { useMemo, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import useAutoCompletePrompt from 'hooks/prompts/useAutoCompletePrompt';
import { Choice } from 'types';
import './AutoCompletePrompt.css';

export type AutoCompletePromptProps = {
    message: string;
    choices: Choice[];
    onSubmit: (data: Choice, textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const AutoCompletePrompt: React.FC<AutoCompletePromptProps> = ({
    message,
    choices,
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

    const { inputRef, filteredChoices, selectedIndex, handleInput, selectPrevious, selectNext } =
        useAutoCompletePrompt(formattedChoices);

    const submit = () => {
        const data = filteredChoices[selectedIndex];
        const textResponse = data.label;
        onSubmit(data, textResponse);
        if (inputRef.current) {
            inputRef.current.textContent = '';
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if ((key === 'Tab' && !isShiftPressed) || key === 'ArrowDown') {
            selectNext();
        }
        if ((key === 'Tab' && isShiftPressed) || key === 'ArrowUp') {
            selectPrevious();
        }
        if (key === 'Enter') {
            submit();
        }
        if (key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
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
                <span
                    ref={inputRef}
                    contentEditable
                    className='autocomplete-field'
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    data-placeholder='Digite um comando...'
                    spellCheck='false'
                    autoCorrect='off'
                    suppressContentEditableWarning={true}
                />
            </div>

            <div className='autocomplete-choices'>
                {filteredChoices.map((choice, index) => (
                    <span
                        key={index}
                        className={`autocomplete-choice ${
                            selectedIndex === index ? 'selected' : ''
                        }`}
                    >
                        {choice.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

AutoCompletePrompt.displayName = 'AutoCompletePrompt';

export { AutoCompletePrompt };

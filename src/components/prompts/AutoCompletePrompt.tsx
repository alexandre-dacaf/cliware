import React, { useMemo, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import useAutoCompletePrompt from 'hooks/prompts/useAutoCompletePrompt';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import { Choice } from 'types';
import './AutoCompletePrompt.css';

export type AutoCompletePromptProps = {
    message: string;
    choices: Choice[];
    maxDisplayedOptions?: number;
    onSubmit: (data: Choice) => void;
    isActive: boolean;
    onEscape: () => void;
};

const AutoCompletePrompt: React.FC<AutoCompletePromptProps> = ({ message, choices, maxDisplayedOptions = 10, onSubmit, isActive, onEscape }) => {
    const formattedChoices = useMemo(
        () =>
            choices.map((choice) => ({
                ...choice,
                value: choice.value ?? choice.label,
            })),
        [choices]
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const { value, setValue, filteredChoices, selectedIndex, handleChange, selectPrevious, selectNext } = useAutoCompletePrompt(formattedChoices);
    const { submit } = usePromptSubmitter(message, onSubmit);

    const handleEnter = () => {
        const clear = () => {
            setValue('');
        };

        submit({ data: filteredChoices[selectedIndex], clear });
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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
            handleEnter();
        }
        if (key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="autocomplete-prompt">
            <div>
                <span className="autocomplete-message">{message}</span>
                <input ref={inputRef} className="autocomplete-field" value={value} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
            </div>

            <div className="autocomplete-choices">
                {filteredChoices.slice(0, maxDisplayedOptions).map((choice, index) => (
                    <span key={index} className={`autocomplete-choice ${selectedIndex === index ? 'selected' : ''}`}>
                        {choice.label}
                    </span>
                ))}
                {filteredChoices.length > maxDisplayedOptions ? <span className="autocomplete-choice">...</span> : null}
            </div>
        </div>
    );
};

AutoCompletePrompt.displayName = 'AutoCompletePrompt';

export { AutoCompletePrompt };

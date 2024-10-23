import React, { useMemo, useRef, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import useSelectPrompt from '../../hooks/prompts/useSelectPrompt';
import { Choice } from '../../types';
import './SelectPrompt.css';

export type SelectPromptProps = {
    message: string;
    choices: Choice[];
    multiselect: boolean;
    onSubmit: (data: Choice[], textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const SelectPrompt: React.FC<SelectPromptProps> = ({ message, choices, multiselect = false, onSubmit, isActive, onEscape }) => {
    const formattedChoices = useMemo(
        () =>
            choices.map((choice) => ({
                ...choice,
                value: choice.value ?? choice.label,
            })),
        [choices]
    );

    const inputRef = useRef<HTMLDivElement>(null);
    const { selectedIndex, checkedIndexes, checkedChoices, selectNext, selectPrevious, checkSelected } = useSelectPrompt(formattedChoices, multiselect);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            selectPrevious();
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            selectNext();
        }

        if (event.key === ' ' || event.code === 'Space') {
            checkSelected();
        }

        if (event.key === 'Enter') {
            const textResponse = checkedChoices.map((choice) => choice.value).join(', ');
            onSubmit(checkedChoices, textResponse);
        }

        if (event.key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    return (
        <div ref={inputRef} className="select-prompt" tabIndex={0} onKeyDown={handleKeyDown}>
            <div className="select-message">{message}</div>
            <div className="select-choices">
                {choices.map((choice, index) => (
                    <span
                        key={index}
                        className={`select-choice ${selectedIndex === index ? 'selected' : ''} ${checkedIndexes.includes(index) ? 'checked' : ''}`}
                    >
                        {choice.label}
                    </span>
                ))}
            </div>
            <span className="select-navigation-hint">
                <em>Use arrow keys to navigate, Space to (de)select and Enter to confirm.</em>
            </span>
        </div>
    );
};

SelectPrompt.displayName = 'SelectPrompt';

export { SelectPrompt };

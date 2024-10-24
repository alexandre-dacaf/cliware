import React, { useMemo, useRef, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import useSelectPrompt from 'hooks/prompts/useSelectPrompt';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import { Choice } from 'types';
import './SelectPrompt.css';

export type SelectPromptProps = {
    message: string;
    choices: Choice[];
    multiselect: boolean;
    onSubmit: (data: Choice[]) => void;
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

    const containerRef = useRef<HTMLDivElement>(null);
    const { selectedIndex, checkedIndexes, checkedChoices, selectNext, selectPrevious, checkSelected } = useSelectPrompt(formattedChoices, multiselect);
    const { submit } = usePromptSubmitter(message, onSubmit);

    const handleEnter = () => {
        submit({ data: checkedChoices });
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
            selectPrevious();
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
            selectNext();
        }
        if (event.key === ' ' || event.code === 'Space') {
            checkSelected();
        }
        if (event.key === 'Enter') {
            handleEnter();
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
        if (isActive && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (containerRef.current && relatedTarget && !containerRef.current.contains(relatedTarget)) {
            // Focus completelly left containerRef
            containerRef.current.focus();
        }
    };

    return (
        <div ref={containerRef} className="select-prompt" tabIndex={0} onKeyDown={handleKeyDown} onBlur={handleBlur}>
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

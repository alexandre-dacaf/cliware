import React, { useRef, useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import './ConfirmPrompt.css';

export type ConfirmPromptProps = {
    message: string;
    onSubmit: (data: boolean, textResponse: string) => void;
    choiceTrueLabel?: string;
    choiceFalseLabel?: string;
    isActive: boolean;
    onEscape: () => void;
};

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({ message, onSubmit, choiceTrueLabel, choiceFalseLabel, isActive, onEscape }) => {
    const inputRef = useRef<HTMLDivElement>(null);

    const choices = [
        { label: choiceFalseLabel ?? 'No', value: false },
        { label: choiceTrueLabel ?? 'Yes', value: true },
    ];

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) => (prevIndex === 0 ? choices.length - 1 : prevIndex - 1));
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) => (prevIndex === choices.length - 1 ? 0 : prevIndex + 1));
        } else if (event.key === 'Enter') {
            onSubmit(choices[selectedIndex].value, choices[selectedIndex].label);
        } else if (event.key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
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
        <div ref={inputRef} className="confirm-prompt" tabIndex={0} onKeyDown={handleKeyDown}>
            <div>
                <span className="confirm-message">{message}</span>
                {choices.map((choice, index) => (
                    <span key={index} className={`confirm-choice ${selectedIndex === index ? 'selected' : ''}`}>
                        {choice.label}
                    </span>
                ))}
            </div>
            <span className="confirm-navigation-hint">
                <em>Use arrow keys to navigate and Enter to confirm.</em>
            </span>
        </div>
    );
};

ConfirmPrompt.displayName = 'ConfirmPrompt';

export { ConfirmPrompt };

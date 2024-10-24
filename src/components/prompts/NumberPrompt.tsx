import React, { useRef, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import useNumberPrompt from 'hooks/prompts/useNumberPrompt';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import './NumberPrompt.css';

export type NumberPromptProps = {
    message: string;
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
    onSubmit: (data: number) => void;
    isActive: boolean;
    onEscape: () => void;
};

const NumberPrompt: React.FC<NumberPromptProps> = ({
    message,
    max = Infinity,
    min = -Infinity,
    step = 1,
    float = false,
    decimals = 2,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, adjustStep, clear } = useNumberPrompt(min, float, decimals);
    const { submit } = usePromptSubmitter(message, onSubmit);

    const handleEnter = () => {
        const validate = (inputValue: string) => {
            const numberContent: number = parseFloat(inputValue);
            if (isNaN(numberContent)) {
                return 'Invalid number.';
            }
            if (numberContent < min) {
                return `Minimum value is ${min}.`;
            }
            if (numberContent > max) {
                return `Maximum value is ${max}.`;
            }

            return true;
        };

        submit({ data: parseFloat(value), clear, validate });
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            handleEnter();
        }
        if (event.key === 'ArrowUp') {
            adjustStep(step);
        }
        if (event.key === 'ArrowDown') {
            adjustStep(-step);
        }
        if (event.key === 'Escape') {
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

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="number-prompt">
            <span className="prompt-message">{message}</span>
            <input ref={inputRef} className="number-field" value={value} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        </div>
    );
};

NumberPrompt.displayName = 'NumberPrompt';

export { NumberPrompt };

import React, { useRef, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import useNumberPrompt from 'hooks/prompts/useNumberPrompt';
import './NumberPrompt.css';
import usePrinter from 'hooks/printer/usePrinter';

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
    const { printInput, printError } = usePrinter();

    const handleEnter = () => {
        const numberValue: number = parseFloat(value);

        if (isNaN(numberValue)) {
            printError('Invalid number.');
            clear();
            return;
        }

        if (numberValue < min) {
            printError(`Minimum value is ${min}.`);
            clear();
            return;
        }

        if (numberValue > max) {
            printError(`Maximum value is ${max}.`);
            clear();
            return;
        }

        printInput(`${message} ${numberValue}`);
        onSubmit(numberValue);
        clear();
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
        <div className='number-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                className='number-field'
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

NumberPrompt.displayName = 'NumberPrompt';

export { NumberPrompt };

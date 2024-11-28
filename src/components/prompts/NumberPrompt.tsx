import React, { useRef, useEffect } from 'react';
import useNumberPrompt from 'hooks/prompts/useNumberPrompt';
import './NumberPrompt.scss';
import { Prompt } from 'types';

interface NumberPromptProps {
    message: string;
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
    defaultValue?: number;
    required?: boolean;
    placeholder?: string;
    isActive: boolean;
    validate?: Prompt.ValidateFunction;
    onSubmit: (data: number) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

const NumberPrompt: React.FC<NumberPromptProps> = ({
    message,
    max = Infinity,
    min = -Infinity,
    step = 1,
    float = false,
    decimals = 2,
    defaultValue = 0,
    required = false,
    placeholder = '',
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, handleKeyDown } = useNumberPrompt({
        message,
        max,
        min,
        step,
        float,
        decimals,
        defaultValue,
        required,
        validate,
        onSubmit,
        onEscape,
        onAbort,
        onGoBack,
    });

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
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

NumberPrompt.displayName = 'NumberPrompt';

export { NumberPrompt };

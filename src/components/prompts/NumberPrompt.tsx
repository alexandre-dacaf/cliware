import React, { useRef, useEffect } from 'react';
import useNumberPrompt from 'hooks/prompts/useNumberPrompt';
import './NumberPrompt.css';

export type NumberPromptProps = {
    message: string;
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
    defaultValue?: number;
    required?: boolean;
    placeholder?: string;
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
    defaultValue = 0,
    required = false,
    placeholder = '',
    onSubmit,
    isActive,
    onEscape,
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
        onSubmit,
        onEscape,
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

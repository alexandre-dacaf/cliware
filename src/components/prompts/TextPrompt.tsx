import React, { useEffect, useRef } from 'react';
import './TextPrompt.css';
import useTextPrompt from 'hooks/prompts/useTextPrompt';
import { ValidateFunction } from 'types';

export type TextPromptProps = {
    message: string;
    defaultValue?: string;
    required?: boolean;
    trim?: boolean;
    placeholder?: string;
    validate?: ValidateFunction;
    isActive: boolean;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const TextPrompt: React.FC<TextPromptProps> = ({
    message,
    defaultValue = '',
    required = false,
    trim = false,
    placeholder = '',
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, handleKeyDown } = useTextPrompt({
        message,
        defaultValue,
        required,
        trim,
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
        <div className='text-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                className='text-field'
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

TextPrompt.displayName = 'TextPrompt';

export { TextPrompt };

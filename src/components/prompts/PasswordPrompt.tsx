import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import usePrinter from 'hooks/printer/usePrinter';
import './PasswordPrompt.css';
import usePasswordPrompt from 'hooks/prompts/usePasswordPrompt';

export type PasswordPromptProps = {
    message: string;
    required?: boolean;
    placeholder?: string;
    onSubmit: (data: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const PasswordPrompt: React.FC<PasswordPromptProps> = ({
    message,
    required = false,
    placeholder = '',
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, handleKeyDown } = usePasswordPrompt({
        message,
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
        <div className='password-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                type='password'
                className='password-field'
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

PasswordPrompt.displayName = 'PasswordPrompt';

export { PasswordPrompt };

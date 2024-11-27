import React, { useRef, useEffect } from 'react';
import './PasswordPrompt.scss';
import usePasswordPrompt from 'hooks/prompts/usePasswordPrompt';
import { ValidateFunction } from 'types';

interface PasswordPromptProps {
    message: string;
    required?: boolean;
    placeholder?: string;
    isActive: boolean;
    validate?: ValidateFunction;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({
    message,
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
    const { value, handleChange, handleKeyDown } = usePasswordPrompt({
        message,
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

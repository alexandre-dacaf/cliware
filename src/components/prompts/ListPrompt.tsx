import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './ListPrompt.css';
import usePrinter from 'hooks/printer/usePrinter';
import useListPrompt from 'hooks/prompts/useListPrompt';
import { ValidateFunction } from 'types';

export type ListPromptProps = {
    message: string;
    separator?: string;
    trim?: boolean;
    required?: boolean;
    placeholder?: string;
    isActive: boolean;
    validate?: ValidateFunction;
    onSubmit: (data: string[]) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const ListPrompt: React.FC<ListPromptProps> = ({
    message,
    separator = ',',
    trim = true,
    required = false,
    placeholder = '',
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, handleKeyDown } = useListPrompt({
        message,
        separator,
        trim,
        required,
        validate,
        onSubmit,
        onEscape,
        onAbort,
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
                className='list-field'
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

ListPrompt.displayName = 'ListPrompt';

export { ListPrompt };

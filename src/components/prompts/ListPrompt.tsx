import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './ListPrompt.css';
import usePrinter from 'hooks/printer/usePrinter';
import useListPrompt from 'hooks/prompts/useListPrompt';

export type ListPromptProps = {
    message: string;
    separator?: string;
    trim?: boolean;
    required?: boolean;
    placeholder?: string;
    onSubmit: (data: string[]) => void;
    isActive: boolean;
    onEscape: () => void;
};

const ListPrompt: React.FC<ListPromptProps> = ({
    message,
    separator = ',',
    trim = true,
    required = false,
    placeholder = '',
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, handleChange, handleKeyDown } = useListPrompt({
        message,
        separator,
        trim,
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

import React, { useRef, useEffect } from 'react';
import './ListPrompt.scss';
import useListPrompt from 'hooks/prompts/useListPrompt';
import { Prompt } from 'types';

interface ListPromptProps {
    message: string;
    separator?: string;
    trim?: boolean;
    required?: boolean;
    placeholder?: string;
    isActive: boolean;
    validate?: Prompt.ValidateFunction;
    onSubmit: (data: string[]) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

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
    onGoBack,
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

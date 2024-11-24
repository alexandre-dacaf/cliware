import React, { useRef, useEffect } from 'react';
import useDatePrompt from 'hooks/prompts/useDatePrompt';
import './DatePrompt.css';

export type DatePromptProps = {
    message: string;
    defaultValue?: string;
    required?: boolean;
    placeholder?: string;
    onSubmit: (data: Date | null) => void;
    isActive: boolean;
    onEscape: () => void;
    onAbort: () => void;
};

const DatePrompt: React.FC<DatePromptProps> = ({
    message,
    defaultValue = '',
    required = false,
    placeholder = '',
    onSubmit,
    isActive,
    onEscape,
    onAbort,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { stringValue, handleChange, handleKeyDown } = useDatePrompt({
        message,
        defaultValue,
        required,
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
        <div className='date-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                className='date-field'
                value={stringValue}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

DatePrompt.displayName = 'DatePrompt';

export { DatePrompt };

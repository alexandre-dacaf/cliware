import React, { useRef, useEffect } from 'react';
import useDatePrompt from 'hooks/prompts/useDatePrompt';
import './DatePrompt.scss';
import { Prompt } from 'types';

interface DatePromptProps {
    message: string;
    defaultValue?: string;
    required?: boolean;
    placeholder?: string;
    isActive: boolean;
    validate?: Prompt.ValidateFunction;
    onSubmit: (data: Date | null) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

const DatePrompt: React.FC<DatePromptProps> = ({
    message,
    defaultValue = '',
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
    const { stringValue, handleChange, handleKeyDown } = useDatePrompt({
        message,
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

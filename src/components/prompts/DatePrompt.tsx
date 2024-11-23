import React, { useRef, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import useDatePrompt from 'hooks/prompts/useDatePrompt';
import './DatePrompt.css';
import usePrinter from 'hooks/printer/usePrinter';

export type DatePromptProps = {
    message: string;
    defaultValue?: string;
    onSubmit: (data: Date) => void;
    isActive: boolean;
    onEscape: () => void;
};

const DatePrompt: React.FC<DatePromptProps> = ({
    message,
    defaultValue = '',
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { stringValue, dateValue, handleChange, clear } = useDatePrompt(defaultValue);
    const { printInput, display } = usePrinter();

    const handleEnter = () => {
        if (!dateValue) {
            display('Invalid date.');
            return;
        }

        printInput(`${message} ${stringValue}`);
        onSubmit(dateValue);
        clear();
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            handleEnter();
        }
        if (event.key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

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
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

DatePrompt.displayName = 'DatePrompt';

export { DatePrompt };

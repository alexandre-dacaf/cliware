import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './TextPrompt.css';
import usePrinter from 'hooks/printer/usePrinter';

export type TextPromptProps = {
    message: string;
    defaultValue?: string;
    required?: boolean;
    trim?: boolean;
    onSubmit: (data: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const TextPrompt: React.FC<TextPromptProps> = ({
    message,
    defaultValue = '',
    required = false,
    trim = false,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');
    const { printInput, display, clearDisplay } = usePrinter();

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();
        setValue(event.target.value);
    };

    const submit = () => {
        let formattedValue = value;

        if (trim) {
            formattedValue = formattedValue.trim();
        }

        if (required && !formattedValue) {
            display('Please fill out this field.');
            return;
        }

        printInput(`${message} ${formattedValue}`);
        onSubmit(formattedValue);
        setValue('');
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (event.key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

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
        <div className='text-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                className='text-field'
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

TextPrompt.displayName = 'TextPrompt';

export { TextPrompt };

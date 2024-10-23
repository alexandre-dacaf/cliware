import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './PasswordPrompt.css';

export type PasswordPromptProps = {
    message: string;
    onSubmit: (data: string, textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ message, onSubmit, isActive, onEscape }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentContent: string = event.target.value;
        setValue(currentContent);
    };

    const submit = () => {
        if (value === '') {
            return;
        }

        onSubmit(value, '•'.repeat(8));
        setValue('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
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
        <div className="password-prompt">
            <span className="prompt-message">{message}</span>
            <input
                ref={inputRef}
                type="password"
                className="password-field"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

PasswordPrompt.displayName = 'PasswordPrompt';

export { PasswordPrompt };

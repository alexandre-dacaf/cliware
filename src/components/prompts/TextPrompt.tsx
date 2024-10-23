import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './TextPrompt.css';

export type TextPromptProps = {
    message: string;
    onSubmit: (data: string, textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const TextPrompt: React.FC<TextPromptProps> = ({ message, onSubmit, isActive, onEscape }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
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
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const submit = () => {
        if (value.trim() === '') {
            return;
        }

        onSubmit(value.trim(), value.trim());
        setValue('');
        if (inputRef.current) {
            inputRef.current.textContent = '';
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
        <div className="text-prompt">
            <span className="prompt-message">{message}</span>
            <input ref={inputRef} className="text-field" value={value} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        </div>
    );
};

TextPrompt.displayName = 'TextPrompt';

export { TextPrompt };

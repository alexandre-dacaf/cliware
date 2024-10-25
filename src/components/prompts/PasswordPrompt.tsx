import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import usePrinter from 'hooks/printer/usePrinter';
import './PasswordPrompt.css';

export type PasswordPromptProps = {
    message: string;
    onSubmit: (data: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const PasswordPrompt: React.FC<PasswordPromptProps> = ({
    message,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');
    const { submit } = usePromptSubmitter(message, onSubmit);
    const { printInput } = usePrinter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentContent: string = event.target.value;
        setValue(currentContent);
    };

    const handleEnter = () => {
        const print = () => {
            printInput(`${message} ${'•'.repeat(8)}`);
        };

        const clear = () => {
            setValue('');
        };

        submit({ data: value, print, clear });
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            handleEnter();
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
        <div className='password-prompt'>
            <span className='prompt-message'>{message}</span>
            <input
                ref={inputRef}
                type='password'
                className='password-field'
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

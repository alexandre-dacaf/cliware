import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import usePromptSubmitter from 'hooks/prompts/usePromptSubmitter';
import './ListPrompt.css';

export type ListPromptProps = {
    message: string;
    separator?: string;
    trim?: boolean;
    onSubmit: (data: string[]) => void;
    isActive: boolean;
    onEscape: () => void;
};

const ListPrompt: React.FC<ListPromptProps> = ({ message, separator = ',', trim = true, onSubmit, isActive, onEscape }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');
    const [list, setList] = useState<string[]>([]);
    const { submit } = usePromptSubmitter(message, onSubmit);

    useEffect(() => {
        let splitContent = value.split(separator);

        if (trim) {
            splitContent = splitContent.map((item) => item.trim());
            splitContent = splitContent.filter((i) => i.length > 0);
        }

        setList(splitContent);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleEnter = () => {
        const clear = () => {
            setValue('');
        };

        submit({ data: list, clear });
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
        <div className="text-prompt">
            <span className="prompt-message">{message}</span>
            <input ref={inputRef} className="list-field" value={value} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        </div>
    );
};

ListPrompt.displayName = 'ListPrompt';

export { ListPrompt };

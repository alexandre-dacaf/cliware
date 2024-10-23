import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './ListPrompt.css';

export type ListPromptProps = {
    message: string;
    separator?: string;
    onSubmit: (data: string[], textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const ListPrompt: React.FC<ListPromptProps> = ({ message, separator = ',', onSubmit, isActive, onEscape }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>('');

    const updateContent = () => {
        if (inputRef.current) {
            const currentContent: string = inputRef.current.textContent ?? '';

            setContent(currentContent);
            // TODO formatting, validation, etc
        }
    };

    const submit = () => {
        const trimmedContent = content.trim();
        let splitContent = trimmedContent.split(separator);
        splitContent = splitContent.map((item) => item.trim());

        if (trimmedContent !== '') {
            onSubmit(splitContent, trimmedContent);
            setContent('');
            if (inputRef.current) {
                inputRef.current.textContent = '';
            }
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }

        if (event.key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="text-prompt">
            <span className="prompt-message">{message}</span>
            <span
                ref={inputRef}
                contentEditable
                className="text-field"
                onInput={updateContent}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                data-placeholder="Digite um comando..."
                spellCheck="false"
                autoCorrect="off"
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

ListPrompt.displayName = 'ListPrompt';

export { ListPrompt };

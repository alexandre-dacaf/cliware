import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './NumberPrompt.css';
import useNumberPrompt from '../../hooks/prompts/useNumberPrompt';

export type NumberPromptProps = {
    message: string;
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
    onSubmit: (data: number, textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const NumberPrompt: React.FC<NumberPromptProps> = ({
    message,
    max = Infinity,
    min = -Infinity,
    step = 1,
    float = false,
    decimals = 2,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const { content, inputRef, handleInput, adjustStep, clearContent } = useNumberPrompt(min, max, float, decimals);

    const submit = () => {
        if (content.trim() === '') {
            return;
        }

        const numberContent: number = parseFloat(content);
        if (isNaN(numberContent)) {
            return;
        }

        onSubmit(numberContent, content);
        clearContent();
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (event.key === 'ArrowUp') {
            adjustStep(step);
        }
        if (event.key === 'ArrowDown') {
            adjustStep(-step);
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

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="number-prompt">
            <span className="prompt-message">{message}</span>
            <span
                ref={inputRef}
                contentEditable
                className="number-field"
                onInput={handleInput}
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

NumberPrompt.displayName = 'NumberPrompt';

export { NumberPrompt };

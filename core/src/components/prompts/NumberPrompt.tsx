import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import './NumberPrompt.css';
import useNumberInput from '../../hooks/useNumberInput';

export type NumberPromptProps = {
    message: string;
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
    onSubmit: (response: number) => void;
    isActive: boolean;
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
}) => {
    const { content, inputRef, handleInput, adjustStep, clearContent } = useNumberInput(
        min,
        max,
        float,
        decimals
    );

    const submitContent = () => {
        if (content.trim() !== '') {
            const numberContent: number = parseFloat(content);
            if (!isNaN(numberContent)) {
                onSubmit(numberContent);
                clearContent();
            }
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitContent();
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            adjustStep(step);
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            adjustStep(-step);
        }
        if (event.key === 'Tab' && isActive) {
            event.preventDefault();
        }
        if (event.key === 'Escape') {
            // Escape, isActive and blur logic
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
        <div className='number-prompt'>
            <span className='prompt-message'>{message}</span>
            <span
                ref={inputRef}
                contentEditable
                className='number-field'
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                data-placeholder='Digite um comando...'
                spellCheck='false'
                autoCorrect='off'
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

NumberPrompt.displayName = 'NumberPrompt';

export { NumberPrompt };

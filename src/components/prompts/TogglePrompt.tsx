import React, { useRef, useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Choice } from 'types';
import usePrinter from 'hooks/printer/usePrinter';
import './TogglePrompt.css';
import useTogglePrompt from 'hooks/prompts/useTogglePrompt';

export type TogglePromptProps = {
    message: string;
    defaultValue?: boolean;
    trueLabel?: string;
    falseLabel?: string;
    isActive: boolean;
    onSubmit: (data: boolean) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const TogglePrompt: React.FC<TogglePromptProps> = ({
    message,
    defaultValue = false,
    trueLabel = 'Yes',
    falseLabel = 'No',
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { choices, toggle, handleKeyDown } = useTogglePrompt({
        message,
        defaultValue,
        trueLabel,
        falseLabel,
        onSubmit,
        onEscape,
        onAbort,
        onGoBack,
    });

    useEffect(() => {
        if (isActive && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (
            containerRef.current &&
            relatedTarget &&
            !containerRef.current.contains(relatedTarget)
        ) {
            // Focus completelly left containerRef
            containerRef.current.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            className='confirm-prompt'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <div>
                <span className='confirm-message'>{message}</span>
                {choices.map((choice, index) => (
                    <span
                        key={index}
                        className={`confirm-choice ${choice.value === toggle ? 'selected' : ''}`}
                    >
                        {choice.label}
                    </span>
                ))}
            </div>
            <span className='confirm-navigation-hint'>
                <em>Use arrow keys to navigate and Enter to confirm.</em>
            </span>
        </div>
    );
};

TogglePrompt.displayName = 'TogglePrompt';

export { TogglePrompt };

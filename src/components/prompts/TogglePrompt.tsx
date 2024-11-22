import React, { useRef, useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Choice } from 'types';
import usePrinter from 'hooks/printer/usePrinter';
import './TogglePrompt.css';

export type TogglePromptProps = {
    message: string;
    onSubmit: (data: boolean) => void;
    trueLabel?: string;
    falseLabel?: string;
    isActive: boolean;
    onEscape: () => void;
};

const TogglePrompt: React.FC<TogglePromptProps> = ({
    message,
    onSubmit,
    trueLabel,
    falseLabel,
    isActive,
    onEscape,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const choices: Choice[] = [
        { label: falseLabel ?? 'No', value: false },
        { label: trueLabel ?? 'Yes', value: true },
    ];
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const { printInput } = usePrinter();

    const handleEnter = () => {
        printInput(`${message} ${choices[selectedIndex].label}`);
        onSubmit(choices[selectedIndex].value);
        setSelectedIndex(0);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (key === 'ArrowLeft' || key === 'ArrowUp' || (key === 'Tab' && isShiftPressed)) {
            setSelectedIndex((prevIndex) => (prevIndex === 0 ? choices.length - 1 : prevIndex - 1));
        } else if (
            key === 'ArrowRight' ||
            key === 'ArrowDown' ||
            (key === 'Tab' && !isShiftPressed)
        ) {
            setSelectedIndex((prevIndex) => (prevIndex === choices.length - 1 ? 0 : prevIndex + 1));
        } else if (key === 'Enter') {
            handleEnter();
        } else if (key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Escape',
        ];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

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
                        className={`confirm-choice ${selectedIndex === index ? 'selected' : ''}`}
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

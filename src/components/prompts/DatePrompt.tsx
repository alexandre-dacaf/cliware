import React, { useRef, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import { DateKeyDownHandler } from 'types';
import useDatePrompt from 'hooks/prompts/useDatePrompt';
import './DatePrompt.css';
import usePrinter from 'hooks/printer/usePrinter';

export type DatePromptProps = {
    message: string;
    onSubmit: (data: Date) => void;
    isActive: boolean;
    onEscape: () => void;
};

const DatePrompt: React.FC<DatePromptProps> = ({ message, onSubmit, isActive, onEscape }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const {
        date,
        yearRef,
        monthRef,
        dayRef,
        yearHandler,
        monthHandler,
        dayHandler,
        focusYear,
        clear,
    } = useDatePrompt(year, month, day);
    const { printInput } = usePrinter();

    const handleEnter = () => {
        if (!date) return;

        const formattedDate = date.toISOString().split('T')[0];
        printInput(`${message} ${formattedDate}`);
        clear();
        onSubmit(date);
    };

    const handleKeyDown =
        (handlers: DateKeyDownHandler) => (event: React.KeyboardEvent<HTMLSpanElement>) => {
            const key = event.key;
            const isShiftPressed = event.shiftKey;
            preventDefaultEvents(event);

            if (key === 'Enter') {
                handleEnter();
            } else if (key === 'ArrowUp') {
                handlers.adjust(1);
            } else if (key === 'ArrowDown') {
                handlers.adjust(-1);
            } else if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
                handlers.focusLeft();
            } else if (key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
                handlers.focusRight();
            } else if (key === 'Escape') {
                onEscape();
            }
        };

    const handleYearKeyDown = handleKeyDown(yearHandler);
    const handleMonthKeyDown = handleKeyDown(monthHandler);
    const handleDayKeyDown = handleKeyDown(dayHandler);

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
        focusYear();
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (
            containerRef.current &&
            relatedTarget &&
            !containerRef.current.contains(relatedTarget)
        ) {
            // Focus completelly left containerRef
            focusYear();
        }
    };

    return (
        <div className='date-prompt' onBlur={handleBlur} ref={containerRef}>
            <span className='prompt-message'>{message}</span>
            <span
                ref={yearRef}
                className='date-field year-field'
                tabIndex={0}
                onKeyDown={handleYearKeyDown}
            />
            -
            <span
                ref={monthRef}
                className='date-field month-field'
                tabIndex={0}
                onKeyDown={handleMonthKeyDown}
            />
            -
            <span
                ref={dayRef}
                className='date-field day-field'
                tabIndex={0}
                onKeyDown={handleDayKeyDown}
            />
        </div>
    );
};

DatePrompt.displayName = 'DatePrompt';

export { DatePrompt };

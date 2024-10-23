import React, { useRef, KeyboardEvent as ReactKeyboardEvent, useEffect } from 'react';
import useDatePrompt from '../../hooks/prompts/useDatePrompt';
import './DatePrompt.css';

export type DatePromptProps = {
    message: string;
    onSubmit: (data: Date, textResponse: string) => void;
    isActive: boolean;
    onEscape: () => void;
};

const DatePrompt: React.FC<DatePromptProps> = ({ message, onSubmit, isActive, onEscape }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();

    const { date, yearRef, monthRef, dayRef, adjustYear, adjustMonth, adjustDay, clear } = useDatePrompt(year, month, day);

    const submit = () => {
        if (date) {
            onSubmit(date, date.toLocaleDateString('pt-BR'));
            clear();
        }
    };

    const handleYearKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (key === 'ArrowUp') {
            adjustYear(1);
        }
        if (key === 'ArrowDown') {
            adjustYear(-1);
        }
        if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
            focusDay();
        }
        if (key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
            focusMonth();
        }
        if (key === 'Escape') {
            onEscape();
        }
    };

    const handleMonthKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (key === 'ArrowUp') {
            adjustMonth(1);
        }
        if (key === 'ArrowDown') {
            adjustMonth(-1);
        }
        if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
            focusYear();
        }
        if (key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
            focusDay();
        }
        if (key === 'Escape') {
            onEscape();
        }
    };

    const handleDayKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (key === 'ArrowUp') {
            adjustDay(1);
        }
        if (key === 'ArrowDown') {
            adjustDay(-1);
        }
        if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
            focusMonth();
        }
        if (key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) {
            focusYear();
        }
        if (key === 'Escape') {
            onEscape();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const focusYear = () => {
        if (isActive && yearRef.current) {
            yearRef.current.focus();
        }
    };

    const focusMonth = () => {
        if (isActive && monthRef.current) {
            monthRef.current.focus();
        }
    };

    const focusDay = () => {
        if (isActive && dayRef.current) {
            dayRef.current.focus();
        }
    };

    useEffect(() => {
        focusYear();
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (containerRef.current && relatedTarget && !containerRef.current.contains(relatedTarget)) {
            // Focus completelly left div.date-prompt (containerRef)
            focusYear();
        }
    };

    return (
        <div className="date-prompt" onBlur={handleBlur} ref={containerRef}>
            <span className="prompt-message">{message}</span>
            <span ref={yearRef} className="date-field year-field" tabIndex={0} onKeyDown={handleYearKeyDown} />
            -
            <span ref={monthRef} className="date-field month-field" tabIndex={0} onKeyDown={handleMonthKeyDown} />
            -
            <span ref={dayRef} className="date-field day-field" tabIndex={0} onKeyDown={handleDayKeyDown} />
        </div>
    );
};

DatePrompt.displayName = 'DatePrompt';

export { DatePrompt };

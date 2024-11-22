import React, { useMemo, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import useAutoCompletePrompt from 'hooks/prompts/useAutoCompletePrompt';
import { Suggestion } from 'types';
import './AutoCompletePrompt.css';
import usePrinter from 'hooks/printer/usePrinter';

export type AutoCompletePromptProps = {
    message: string;
    suggestions: Suggestion[];
    itemsPerPage?: number;
    onSubmit: (data: Suggestion) => void;
    isActive: boolean;
    onEscape: () => void;
};

const AutoCompletePrompt: React.FC<AutoCompletePromptProps> = ({
    message,
    suggestions,
    itemsPerPage = 10,
    onSubmit,
    isActive,
    onEscape,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        value,
        setValue,
        pageSuggestions,
        pageIndex,
        handleChange,
        selectPrevious,
        selectNext,
        nextPage,
        prevPage,
        currentPage,
        totalPages,
        autocomplete,
    } = useAutoCompletePrompt(suggestions, itemsPerPage);
    const { printInput } = usePrinter();

    const handleEnter = () => {
        printInput(`${message} ${value}`);
        setValue('');
        onSubmit(value);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;

        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (key === 'ArrowDown') {
            selectNext();
        }
        if (key === 'ArrowUp') {
            selectPrevious();
        }
        if (key === 'Enter') {
            handleEnter();
        }
        if (key === 'Tab') {
            autocomplete();
        }
        if (key === 'Escape') {
            onEscape();
        }
        if (key === 'PageDown') {
            nextPage();
        }
        if (key === 'PageUp') {
            prevPage();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape', 'PageDown', 'PageUp'];

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
        <div className='autocomplete-prompt'>
            <div>
                <span className='autocomplete-message'>{message}</span>
                <input
                    ref={inputRef}
                    className='autocomplete-field'
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            </div>

            <div className='autocomplete-suggestions'>
                {pageSuggestions.map((suggestion, index) => (
                    <span
                        key={index}
                        className={`autocomplete-suggestion ${
                            pageIndex === index ? 'selected' : ''
                        }`}
                    >
                        {suggestion}
                    </span>
                ))}
                {suggestions.length > itemsPerPage ? (
                    <em className='autocomplete-pages'>
                        Page {currentPage + 1}/{totalPages}
                    </em>
                ) : null}
            </div>
        </div>
    );
};

AutoCompletePrompt.displayName = 'AutoCompletePrompt';

export { AutoCompletePrompt };

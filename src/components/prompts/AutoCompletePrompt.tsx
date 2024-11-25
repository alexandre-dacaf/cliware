import React, { useEffect, useRef } from 'react';
import useAutoCompletePrompt from 'hooks/prompts/useAutoCompletePrompt';
import './AutoCompletePrompt.css';
import { ValidateFunction } from 'types';

interface AutoCompletePromptProps {
    message: string;
    suggestions: string[];
    itemsPerPage?: number;
    defaultValue?: string;
    required?: boolean;
    placeholder?: string;
    validate?: ValidateFunction;
    isActive: boolean;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

const AutoCompletePrompt: React.FC<AutoCompletePromptProps> = ({
    message,
    suggestions,
    itemsPerPage = 10,
    defaultValue = '',
    required = false,
    placeholder = '',
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        value,
        pageSuggestions,
        pageIndex,
        handleChange,
        handleKeyDown,
        currentPage,
        totalPages,
    } = useAutoCompletePrompt({
        message,
        suggestions,
        itemsPerPage,
        defaultValue,
        required,
        validate,
        onSubmit,
        onEscape,
        onAbort,
        onGoBack,
    });

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
                    placeholder={placeholder}
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

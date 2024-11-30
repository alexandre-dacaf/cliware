import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';

import { useState, useEffect, useMemo, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Prompt } from 'types';

type UseAutoCompletePromptProps = {
    message: string;
    suggestions: string[];
    itemsPerPage: number;
    defaultValue: string;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useSelectPrompt = ({
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
}: UseAutoCompletePromptProps) => {
    const [value, setValue] = useState<string>('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [pageSuggestions, setPageSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const { logPromptResponse } = useHistoryLogger();
    const { setMessageAlert, clearDisplay } = useMessagePanel();

    const totalPages = useMemo(
        () => Math.ceil(filteredSuggestions.length / itemsPerPage),
        [filteredSuggestions, itemsPerPage]
    );

    useEffect(() => {
        setFilteredSuggestions(suggestions);
    }, [suggestions]);

    useEffect(() => {
        setValue(defaultValue);

        const index = suggestions.indexOf(defaultValue);

        if (index !== -1) {
            setSelectedIndex(index);
            setCurrentPage(Math.floor(index / itemsPerPage));
        } else {
            setSelectedIndex(0);
            setCurrentPage(0);
        }
    }, [defaultValue, suggestions, itemsPerPage]);

    useEffect(() => {
        setPageSuggestions(
            filteredSuggestions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        );
    }, [filteredSuggestions, currentPage, itemsPerPage]);

    useEffect(() => {
        setPageIndex(selectedIndex - currentPage * itemsPerPage);
    }, [selectedIndex, currentPage, itemsPerPage]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();

        const inputValue = event.target.value;
        setValue(inputValue);

        if (inputValue.trim() === '') {
            setFilteredSuggestions(suggestions);
            return;
        }

        const normalizeText = (text: string) =>
            text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const pattern = new RegExp(normalizeText(inputValue), 'i');

        const newFilteredSuggestions = suggestions.filter((suggestion) => {
            return pattern.test(normalizeText(suggestion));
        });

        setFilteredSuggestions(newFilteredSuggestions);
    };

    const autocomplete = () => {
        const selectedSuggestion = pageSuggestions[pageIndex];
        setValue(selectedSuggestion);
    };

    const selectPrevious = () => {
        if (filteredSuggestions.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            if (newIndex < 0) {
                setCurrentPage(totalPages - 1);
                return filteredSuggestions.length - 1;
            }

            const newPage = Math.floor(newIndex / itemsPerPage);
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }

            return newIndex;
        });
    };

    const selectNext = () => {
        if (filteredSuggestions.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex >= filteredSuggestions.length) {
                setCurrentPage(0);
                return 0;
            }

            const newPage = Math.floor(newIndex / itemsPerPage);
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }

            return newIndex;
        });
    };

    const nextPage = () => {
        if (filteredSuggestions.length === 0) return;

        setCurrentPage((prevPage) => {
            const newPage = prevPage + 1;
            if (newPage >= totalPages) {
                setSelectedIndex(0);
                return 0;
            } else {
                setSelectedIndex(newPage * itemsPerPage);
                return newPage;
            }
        });
    };

    const prevPage = () => {
        if (filteredSuggestions.length === 0) return;

        setCurrentPage((prevPage) => {
            const newPage = prevPage - 1;
            if (newPage < 0) {
                const lastPage = totalPages - 1;
                setSelectedIndex(lastPage * itemsPerPage);
                return lastPage;
            } else {
                setSelectedIndex(newPage * itemsPerPage);
                return newPage;
            }
        });
    };

    const submit = () => {
        if (required && !value) {
            setMessageAlert('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(value);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageAlert(validationMessage);
            return;
        }

        logPromptResponse(`${message} ${value}`);
        setValue('');
        onSubmit(value);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        const isCtrlPressed = event.ctrlKey;
        preventDefaultEvents(event);

        if (key === 'ArrowDown') {
            selectNext();
        } else if (key === 'ArrowUp' && !isCtrlPressed) {
            selectPrevious();
        } else if (key === 'Enter' && !isCtrlPressed) {
            submit();
        } else if (key === 'Tab') {
            autocomplete();
        } else if (key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (key === 'Escape' && isCtrlPressed) {
            onAbort();
        } else if (key === 'ArrowUp' && isCtrlPressed) {
            onGoBack();
        } else if (key === 'PageDown') {
            nextPage();
        } else if (key === 'PageUp') {
            prevPage();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape', 'PageDown', 'PageUp'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return {
        value,
        pageSuggestions,
        pageIndex,
        handleChange,
        handleKeyDown,
        currentPage,
        totalPages,
    };
};

export default useSelectPrompt;

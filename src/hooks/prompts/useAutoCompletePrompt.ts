import { useState, useEffect, useMemo } from 'react';

const useSelectPrompt = (suggestions: string[], itemsPerPage: number, defaultValue: string) => {
    const [value, setValue] = useState<string>('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [pageSuggestions, setPageSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

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
        console.log(index);

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

    return {
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
    };
};

export default useSelectPrompt;

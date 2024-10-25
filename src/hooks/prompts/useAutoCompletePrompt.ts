import { useState, useEffect, useMemo } from 'react';
import { Choice } from 'types';

const useSelectPrompt = (choices: Choice[], itemsPerPage: number) => {
    const [value, setValue] = useState<string>('');
    const [filteredChoices, setFilteredChoices] = useState<Choice[]>([]);
    const [pageChoices, setPageChoices] = useState<Choice[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const totalPages = useMemo(
        () => Math.ceil(filteredChoices.length / itemsPerPage),
        [filteredChoices, itemsPerPage]
    );

    useEffect(() => {
        setFilteredChoices(choices);
        setSelectedIndex(0);
        setCurrentPage(0);
    }, [choices]);

    useEffect(() => {
        setSelectedIndex(0);
        setCurrentPage(0);
    }, [filteredChoices]);

    useEffect(() => {
        setPageChoices(
            filteredChoices.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        );
    }, [filteredChoices, currentPage, itemsPerPage]);

    useEffect(() => {
        setPageIndex(selectedIndex - currentPage * itemsPerPage);
    }, [selectedIndex, currentPage, itemsPerPage]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setValue(inputValue);

        if (inputValue.trim() === '') {
            setFilteredChoices(choices);
            return;
        }

        const normalizeText = (text: string) =>
            text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const pattern = new RegExp(normalizeText(inputValue), 'i');

        const newFilteredChoices = choices.filter((choice) => {
            return pattern.test(normalizeText(choice.label));
        });

        setFilteredChoices(newFilteredChoices);
    };

    const selectPrevious = () => {
        if (filteredChoices.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            if (newIndex < 0) {
                setCurrentPage(totalPages - 1);
                return filteredChoices.length - 1;
            }

            const newPage = Math.floor(newIndex / itemsPerPage);
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }

            return newIndex;
        });
    };

    const selectNext = () => {
        if (filteredChoices.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex >= filteredChoices.length) {
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
        if (filteredChoices.length === 0) return;

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
        if (filteredChoices.length === 0) return;

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
        pageChoices,
        pageIndex,
        handleChange,
        selectPrevious,
        selectNext,
        nextPage,
        prevPage,
        currentPage,
        totalPages,
    };
};

export default useSelectPrompt;

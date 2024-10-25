import { useState, useEffect, useMemo } from 'react';

const useCommandInput = (availableCommands: string[], itemsPerPage: number) => {
    const [value, setValue] = useState<string>('');
    const [filteredCommands, setFilteredCommands] = useState<string[]>([]);
    const [pageCommands, setPageCommands] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const totalPages = useMemo(
        () => Math.ceil(filteredCommands.length / itemsPerPage),
        [filteredCommands, itemsPerPage]
    );

    useEffect(() => {
        setFilteredCommands(availableCommands);
        setSelectedIndex(0);
        setCurrentPage(0);
    }, [availableCommands]);

    useEffect(() => {
        setSelectedIndex(0);
        setCurrentPage(0);
    }, [filteredCommands]);

    useEffect(() => {
        setPageCommands(
            filteredCommands.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        );
    }, [filteredCommands, currentPage, itemsPerPage]);

    useEffect(() => {
        setPageIndex(selectedIndex - currentPage * itemsPerPage);
    }, [selectedIndex, currentPage, itemsPerPage]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setValue(inputValue);

        if (inputValue.trim() === '') {
            setFilteredCommands(availableCommands);
            return;
        }

        const normalizeText = (text: string) =>
            text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const pattern = new RegExp(normalizeText(inputValue), 'i');

        const newFilteredCommands = availableCommands.filter((choice) => {
            return pattern.test(normalizeText(choice));
        });

        setFilteredCommands(newFilteredCommands);
    };

    const selectPrevious = () => {
        if (filteredCommands.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            if (newIndex < 0) {
                setCurrentPage(totalPages - 1);
                return filteredCommands.length - 1;
            }

            const newPage = Math.floor(newIndex / itemsPerPage);
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }

            return newIndex;
        });
    };

    const selectNext = () => {
        if (filteredCommands.length === 0) return;

        setSelectedIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex >= filteredCommands.length) {
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
        if (filteredCommands.length === 0) return;

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
        if (filteredCommands.length === 0) return;

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
        pageCommands,
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

export default useCommandInput;

import { AppContext } from 'context/AppContext';
import {
    useState,
    useEffect,
    useMemo,
    KeyboardEvent as ReactKeyboardEvent,
    useContext,
} from 'react';
import { parseCommandArguments } from 'services/parser';
import { Command } from 'types';

interface UseCommandInputProps {
    availableCommands: string[];
    itemsPerPage: number;
    onSubmit: (commandString: string, commandArgs: Command.Args) => void;
    isActive: boolean;
}

const useIdleConsole = ({
    availableCommands,
    itemsPerPage,
    onSubmit,
    isActive,
}: UseCommandInputProps) => {
    const { dispatch } = useContext(AppContext);
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

    const autocomplete = () => {
        const selectedValue = pageCommands[pageIndex];
        setValue(selectedValue);
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

    const submit = () => {
        const commandString = value;
        const commandArgs: Command.Args = parseCommandArguments(commandString);
        onSubmit(commandString, commandArgs);
        setValue('');
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        preventDefaultEvents(event);

        if (key === 'ArrowDown') {
            selectNext();
        }
        if (key === 'ArrowUp') {
            selectPrevious();
        }
        if (key === 'Tab') {
            autocomplete();
        }
        if (key === 'Enter') {
            submit();
        }
        if (key === 'Escape') {
            deactivateTerminal();
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

    const deactivateTerminal = () => {
        if (isActive) {
            dispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

    return {
        value,
        pageCommands,
        pageIndex,
        handleChange,
        currentPage,
        totalPages,
        handleKeyDown,
    };
};

export default useIdleConsole;

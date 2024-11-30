import { blueprint } from 'blueprints/blueprint';
import { AppContext } from 'context/AppContext';
import { TerminalContext } from 'context/TerminalContext';
import {
    KeyboardEvent as ReactKeyboardEvent,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UseIdleConsoleProps {
    itemsPerPage: number;
    isActive: boolean;
}

const useIdleConsole = ({ itemsPerPage, isActive }: UseIdleConsoleProps) => {
    const availableCommands = useRef(Object.keys(blueprint).sort());
    const [value, setValue] = useState<string>('');
    const [filteredCommands, setFilteredCommands] = useState<string[]>([]);
    const [pageCommands, setPageCommands] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const { dispatch: appDispatch } = useContext(AppContext);
    const { state: terminalState, dispatch: terminalDispatch } = useContext(TerminalContext);

    const totalPages = useMemo(
        () => Math.ceil(filteredCommands.length / itemsPerPage),
        [filteredCommands, itemsPerPage]
    );

    useEffect(() => {
        setFilteredCommands(availableCommands.current);
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
            setFilteredCommands(availableCommands.current);
            return;
        }

        const normalizeText = (text: string) =>
            text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const pattern = new RegExp(normalizeText(inputValue), 'i');

        const newFilteredCommands = availableCommands.current.filter((choice) => {
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
        const newGroupId = uuidv4();
        const consoleInput = value;

        terminalDispatch({
            type: 'START_NEW_COMMAND',
            payload: {
                currentBlockId: terminalState.currentHistoryBlockId,
                newGroupId,
                consoleInput,
            },
        });

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
            appDispatch({ type: 'DEACTIVATE_TERMINAL' });
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
        availableCommands,
    };
};

export default useIdleConsole;

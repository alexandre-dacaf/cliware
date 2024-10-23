import { TerminalType } from 'types';
import { useState, useEffect, useRef, useContext } from 'react';
import { TerminalContext } from 'context/TerminalContext';

const useApp = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [columns, setColumns] = useState(2);
    const [terminals, setTerminals] = useState<TerminalType[]>([{ id: 1 }, { id: 2 }]);

    const { state, dispatch } = useContext(TerminalContext);

    const stateRef = useRef(state);
    const terminalContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        window.addEventListener('createTerminal', createTerminal);

        window.addEventListener('deleteTerminal', deleteTerminal);

        const handleChangeColumns = (event: Event) => {
            const customEvent = event as CustomEvent;
            setColumns(customEvent.detail.columns);
        };

        window.addEventListener('changeTerminalColumns', handleChangeColumns);

        return () => {
            window.removeEventListener('createTerminal', createTerminal);
            window.removeEventListener('deleteTerminal', deleteTerminal);
            window.removeEventListener('changeTerminalColumns', handleChangeColumns);
        };
    }, []);

    const selectNextTerminal = () => {
        const currentTerminalIndex = getCurrentTerminalIndex();
        const nextIndex = (currentTerminalIndex + 1) % terminals.length;

        dispatch({
            type: 'SET_SELECTED_TERMINAL',
            payload: terminals[nextIndex].id,
        });

        focusSelf();
    };

    const selectPreviousTerminal = () => {
        const currentTerminalIndex = getCurrentTerminalIndex();
        const prevIndex = (currentTerminalIndex - 1 + terminals.length) % terminals.length;

        dispatch({
            type: 'SET_SELECTED_TERMINAL',
            payload: terminals[prevIndex].id,
        });

        focusSelf();
    };

    const activateTerminal = () => {
        dispatch({ type: 'ACTIVATE_TERMINAL' });
    };

    const createTerminal = () => {
        setTerminals((prev) => {
            let maxTerminalId = 0;
            if (prev.length !== 0) {
                maxTerminalId = prev.reduce(
                    (max, item) => (item.id > max ? item.id : max),
                    prev[0].id
                );
            }
            const newTerminal = { id: maxTerminalId + 1 };
            console.log(newTerminal);
            return [...prev, newTerminal];
        });
    };

    const deleteTerminal = () => {
        setTerminals((prevTerminals) => {
            const currentTerminalId =
                stateRef.current.activeTerminalId ?? stateRef.current.selectedTerminalId;

            if (currentTerminalId === null) {
                return prevTerminals;
            }

            const filteredTerminals = prevTerminals.filter((t) => t.id !== currentTerminalId);

            return filteredTerminals;
        });

        dispatch({
            type: 'SET_ACTIVE_TERMINAL',
            payload: terminals[0].id,
        });
    };

    const getCurrentTerminalIndex = () => {
        return terminals.findIndex(
            (terminal) =>
                terminal.id === stateRef.current.activeTerminalId ||
                terminal.id === stateRef.current.selectedTerminalId
        );
    };

    const focusSelf = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            terminalContainerRef.current.focus();
        }
    };

    const someTerminalActive = () => {
        return stateRef.current.activeTerminalId !== null;
    };

    return {
        state,
        terminalContainerRef,
        columns,
        terminals,
        selectNextTerminal,
        selectPreviousTerminal,
        activateTerminal,
        someTerminalActive,
        createTerminal,
        deleteTerminal,
        focusSelf,
    };
};

export default useApp;

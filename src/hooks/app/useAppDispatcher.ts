import { AppContext } from 'context/AppContext';
import { useContext } from 'react';
import { Hooks } from 'types';
import { v4 as uuidv4 } from 'uuid';

const useAppDispatcher = (): Hooks.UseAppDispatcherMethods => {
    const { state, dispatch } = useContext(AppContext);

    const changeTerminalColumns = (payload: number) => {
        dispatch({ type: 'CHANGE_TERMINAL_COLUMNS', payload });
    };

    const createTerminal = () => {
        const { currentTerminalId, terminalList } = state;

        if (!currentTerminalId) return;

        const currentIndex = terminalList.findIndex((t) => t.id === currentTerminalId);

        const beforeId = currentTerminalId; // The current terminal is the "before"
        const afterId =
            currentIndex < terminalList.length - 1
                ? terminalList[currentIndex + 1].id // The next terminal
                : null; // If there is no next terminal, it's the end of the list

        const newTerminalId = uuidv4();

        dispatch({ type: 'CREATE_TERMINAL', payload: { beforeId, afterId, newTerminalId } });
    };

    const deleteTerminal = (terminalId: string) => {
        dispatch({ type: 'DELETE_TERMINAL', payload: { terminalToDeleteId: terminalId } });
    };

    const deleteCurrentTerminal = () => {
        if (!state.currentTerminalId) return;

        dispatch({
            type: 'DELETE_TERMINAL',
            payload: { terminalToDeleteId: state.currentTerminalId },
        });
    };

    const activateTerminal = () => {
        dispatch({ type: 'ACTIVATE_TERMINAL' });
    };

    const deactivateTerminal = () => {
        dispatch({ type: 'DEACTIVATE_TERMINAL' });
    };

    const selectNextTerminal = () => {
        dispatch({ type: 'SELECT_NEXT_TERMINAL' });
    };

    const selectPreviousTerminal = () => {
        dispatch({ type: 'SELECT_PREVIOUS_TERMINAL' });
    };

    return {
        changeTerminalColumns,
        createTerminal,
        deleteTerminal,
        deleteCurrentTerminal,
        activateTerminal,
        deactivateTerminal,
        selectNextTerminal,
        selectPreviousTerminal,
    };
};

export default useAppDispatcher;

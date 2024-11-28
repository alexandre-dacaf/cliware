import { useRef, useContext } from 'react';
import { AppContext } from 'context/AppContext';

const useApp = () => {
    const { state, dispatch } = useContext(AppContext);
    const terminalContainerRef = useRef<HTMLDivElement>(null);

    const focusSelf = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            terminalContainerRef.current.focus();
        }
    };

    const someTerminalActive = () => {
        return state.currentTerminalId !== null && state.currentTerminalState === 'active';
    };

    return {
        state,
        terminalContainerRef,
        someTerminalActive,
        focusSelf,
    };
};

export default useApp;

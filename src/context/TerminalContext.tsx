import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { Terminal } from '../types';
import { terminalReducer, initialTerminalState } from './terminalReducer';

interface TerminalContextProps {
    state: Terminal.TerminalState;
    dispatch: Dispatch<Terminal.TerminalAction>;
}

export const TerminalContext = createContext<TerminalContextProps>({
    state: initialTerminalState,
    dispatch: () => null,
});

interface TerminalProviderProps {
    children: ReactNode;
}

export const TerminalProvider: React.FC<TerminalProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(terminalReducer, initialTerminalState);

    return (
        <TerminalContext.Provider value={{ state, dispatch }}>{children}</TerminalContext.Provider>
    );
};

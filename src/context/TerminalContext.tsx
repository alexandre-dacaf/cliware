import React, { createContext, useReducer, Dispatch, ReactNode } from "react";
import { TerminalState, TerminalAction } from "../types";
import {
    terminalReducer,
    initialTerminalState,
} from "../context/terminalReducer";

interface TerminalContextProps {
    state: TerminalState;
    dispatch: Dispatch<TerminalAction>;
}

export const TerminalContext = createContext<TerminalContextProps>({
    state: initialTerminalState,
    dispatch: () => null,
});

interface TerminalProviderProps {
    children: ReactNode;
}

export const TerminalProvider: React.FC<TerminalProviderProps> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(terminalReducer, initialTerminalState);

    return (
        <TerminalContext.Provider value={{ state, dispatch }}>
            {children}
        </TerminalContext.Provider>
    );
};

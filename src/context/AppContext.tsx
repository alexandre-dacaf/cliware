import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { App } from '../types';
import { appReducer, initialAppState } from './appReducer';

interface AppContextProps {
    state: App.AppState;
    dispatch: Dispatch<App.AppAction>;
}

export const AppContext = createContext<AppContextProps>({
    state: initialAppState,
    dispatch: () => null,
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialAppState, (init) => ({
        ...init,
        currentTerminalId: init.terminalList[0].id,
    }));

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

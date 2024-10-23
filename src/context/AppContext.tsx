import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { AppState, AppAction } from '../types';
import { appReducer, initialAppState } from './appReducer';

interface AppContextProps {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextProps>({
    state: initialAppState,
    dispatch: () => null,
});

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialAppState);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

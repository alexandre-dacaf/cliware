import { TerminalState, TerminalAction } from 'types';

export const initialTerminalState: TerminalState = {
    commandArgs: null,
    commandBlueprint: null,
    printHistory: [],
    display: null,
};

export const terminalReducer = (state: TerminalState, action: TerminalAction): TerminalState => {
    switch (action.type) {
        case 'STANDBY':
            return { ...state, commandArgs: null, commandBlueprint: null, display: null };
        case 'SET_COMMAND_ARGS':
            return { ...state, commandArgs: action.payload };
        case 'SET_COMMAND_BLUEPRINT':
            return { ...state, commandBlueprint: action.payload };
        case 'ADD_OUTPUT_TO_TERMINAL_HISTORY':
            const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
            return { ...state, printHistory: [...state.printHistory, ...payloadArray] };
        case 'SET_TRANSIENT_OUTPUT':
            return { ...state, display: action.payload };
        case 'CLEAR_TRANSIENT_OUTPUT':
            return { ...state, display: null };
        default:
            return state;
    }
};

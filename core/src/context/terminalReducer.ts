import { TerminalState, TerminalAction } from "../types";

export const initialTerminalState: TerminalState = {
    activeTerminalId: 1,
    selectedTerminalId: null,
};

export const terminalReducer = (
    state: TerminalState,
    action: TerminalAction
): TerminalState => {
    switch (action.type) {
        case "SET_ACTIVE_TERMINAL":
            return { ...state, activeTerminalId: action.payload };
        case "SET_SELECTED_TERMINAL":
            return {
                activeTerminalId: null,
                selectedTerminalId: action.payload,
            };
        case "DEACTIVATE_TERMINAL":
            if (state.activeTerminalId !== null) {
                return {
                    activeTerminalId: null,
                    selectedTerminalId: state.activeTerminalId,
                };
            }
            return state;
        case "ACTIVATE_TERMINAL":
            if (state.selectedTerminalId !== null) {
                return {
                    activeTerminalId: state.selectedTerminalId,
                    selectedTerminalId: null,
                };
            }
            return state;
        default:
            return state;
    }
};

export interface TerminalType {
    id: number;
}

export interface TerminalState {
    activeTerminalId: number | null;
    selectedTerminalId: number | null;
}

export type TerminalAction =
    | { type: "SET_ACTIVE_TERMINAL"; payload: number }
    | { type: "SET_SELECTED_TERMINAL"; payload: number }
    | { type: "DEACTIVATE_TERMINAL" }
    | { type: "ACTIVATE_TERMINAL" };

import { AppState, AppAction, TerminalType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialAppState: AppState = {
    terminalList: [{ id: uuidv4() }, { id: uuidv4() }],
    currentTerminalId: null,
    currentTerminalState: 'active',
    terminalColumns: 2,
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'CREATE_TERMINAL': {
            const { beforeId, afterId, newTerminalId } = action.payload;

            // Check if the terminal already exists
            if (state.terminalList.some((terminal) => terminal.id === newTerminalId)) {
                return state; // Ignore duplicate action
            }

            // Find the indexes based on the provided IDs
            const beforeIndex = state.terminalList.findIndex((t) => t.id === beforeId);

            // Validate that the beforeId is the last one when afterId is null
            if (afterId === null && beforeIndex !== state.terminalList.length - 1) {
                return state; // Invalid position, ignore the action
            }

            const afterIndex = afterId ? state.terminalList.findIndex((t) => t.id === afterId) : -1;

            if (beforeIndex === -1 || afterIndex === -1 || afterIndex !== beforeIndex + 1) {
                return state; // IDs are not consecutive, ignore the action
            }

            // Determine the insertion index
            const insertIndex = afterId === null ? state.terminalList.length : afterIndex;

            // Create the new terminal
            const newTerminal = { id: newTerminalId };

            // Insert the terminal at the correct position
            const updatedTerminals = [
                ...state.terminalList.slice(0, insertIndex),
                newTerminal,
                ...state.terminalList.slice(insertIndex),
            ];

            return {
                ...state,
                terminalList: updatedTerminals,
            };
        }
        case 'DELETE_TERMINAL': {
            const { terminalToDeleteId } = action.payload;
            const newTerminalList = state.terminalList.filter((t) => t.id !== terminalToDeleteId);

            if (newTerminalList.length === 0) {
                return state; // Prevent deleting the last terminal
            }

            let newCurrentTerminalId = state.currentTerminalId;

            if (state.currentTerminalId === terminalToDeleteId) {
                const deletedIndex = state.terminalList.findIndex(
                    (t) => t.id === terminalToDeleteId
                );
                // Select next terminal, or select the previous one if it was the last
                if (deletedIndex !== -1) {
                    const nextIndex =
                        deletedIndex < newTerminalList.length
                            ? deletedIndex
                            : newTerminalList.length - 1;
                    newCurrentTerminalId = newTerminalList[nextIndex].id;
                }
            }

            return {
                ...state,
                terminalList: newTerminalList,
                currentTerminalId: newCurrentTerminalId,
            };
        }
        case 'ACTIVATE_TERMINAL': {
            return {
                ...state,
                currentTerminalState: 'active',
            };
        }
        case 'DEACTIVATE_TERMINAL': {
            return {
                ...state,
                currentTerminalState: 'focused',
            };
        }
        case 'SELECT_NEXT_TERMINAL': {
            const currentIndex = state.terminalList.findIndex(
                (t) => t.id === state.currentTerminalId
            );
            if (currentIndex === -1) return state;

            const nextIndex = (currentIndex + 1) % state.terminalList.length;
            return {
                ...state,
                currentTerminalId: state.terminalList[nextIndex].id,
            };
        }
        case 'SELECT_PREVIOUS_TERMINAL': {
            const currentIndex = state.terminalList.findIndex(
                (t) => t.id === state.currentTerminalId
            );
            if (currentIndex === -1) return state;

            const previousIndex =
                (currentIndex - 1 + state.terminalList.length) % state.terminalList.length;
            return {
                ...state,
                currentTerminalId: state.terminalList[previousIndex].id,
            };
        }
        case 'CHANGE_TERMINAL_COLUMNS':
            return { ...state, terminalColumns: action.payload };
        default:
            return state;
    }
};

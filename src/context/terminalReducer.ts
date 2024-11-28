import { ensureArray } from 'services';
import { Terminal, History } from 'types';

export const initialTerminalState: Terminal.TerminalState = {
    commandArgs: null,
    command: null,
    currentHistoryGroupId: null,
    printHistory: [],
    display: null,
};

export const terminalReducer = (
    state: Terminal.TerminalState,
    action: Terminal.TerminalAction
): Terminal.TerminalState => {
    switch (action.type) {
        case 'STANDBY': {
            return {
                ...state,
                commandArgs: null,
                command: null,
                display: null,
                currentHistoryGroupId: null,
            };
        }
        case 'START_NEW_COMMAND': {
            const { currentGroupId, newGroupId, commandString, command, commandArgs } =
                action.payload;

            if (currentGroupId !== state.currentHistoryGroupId) {
                return state;
            }

            const entries: History.HistoryEntry[] = [
                { type: 'text', content: { color: 'blue', text: `> ${commandString}` } },
            ];

            const newHistoryGroup: History.HistoryGroup = { id: newGroupId, entries };
            const history = state.printHistory;

            return {
                ...state,
                currentHistoryGroupId: newGroupId,
                printHistory: [...history, newHistoryGroup],
                command,
                commandArgs,
            };
        }
        case 'COMMAND_NOT_FOUND': {
            const { currentGroupId, newGroupId, commandString } = action.payload;

            if (currentGroupId !== state.currentHistoryGroupId) {
                return state;
            }

            const cmd = commandString.split(' ')[0];

            const entries: History.HistoryEntry[] = [
                { type: 'text', content: { color: 'blue', text: `> ${commandString}` } },
                {
                    type: 'text',
                    content: { color: 'red', text: `Command '${cmd}' not found.` },
                },
            ];

            const newHistoryGroup: History.HistoryGroup = { id: newGroupId, entries };
            const history = state.printHistory;

            return {
                ...state,
                printHistory: [...history, newHistoryGroup],
                commandArgs: null,
                command: null,
                display: null,
                currentHistoryGroupId: null,
            };
        }
        case 'LOG_HISTORY_ENTRY': {
            const currentGroupId = state.currentHistoryGroupId;

            if (!currentGroupId) {
                return state;
            }

            // Makes sure the dispatcher matches the groupId
            const payloadCurrentGroupId = action.payload.currentGroupId;

            if (payloadCurrentGroupId !== currentGroupId) {
                return state;
            }

            // Gets whole printHistory, made of History.HistoryGroup entries { id: string, entries: entries: History.HistoryEntry[] }
            const history = state.printHistory;

            // Gets the currentGroup, checks if it exists and if it has an entries property array
            const currentGroup = history.find((historyGroup) => historyGroup.id === currentGroupId);

            if (!currentGroup || !currentGroup.entries) {
                return state;
            }

            // Entries can be History.HistoryEntry or History.HistoryEntry[]. Makes sure it's an array
            const payloadEntries = action.payload.entries;
            const payloadEntriesArray = ensureArray(payloadEntries);

            // Inserts all payload entries at the end of the currentGroup.entries array
            const newHistoryGroup = {
                ...currentGroup,
                entries: [...currentGroup.entries, ...payloadEntriesArray],
            };

            // Gets the remaining HistoryGroups in printHistory that are not the currentGroup
            const remainingGroups = history.filter(
                (historyGroup) => historyGroup.id !== currentGroupId
            );

            return {
                ...state,
                printHistory: [...remainingGroups, newHistoryGroup],
            };
        }
        case 'SET_DISPLAY_TEXT': {
            return { ...state, display: { ...state.display, text: action.payload } };
        }
        case 'SET_DISPLAY_SPINNER': {
            return { ...state, display: { ...state.display, spinner: action.payload } };
        }
        case 'SET_PROGRESS_BAR_STYLE': {
            if (action.payload === null) {
                return {
                    ...state,
                    display: { ...state.display, progressBar: undefined },
                };
            }

            const progressBarProps = Object.fromEntries(
                Object.entries(action.payload).filter(([, value]) => value !== undefined)
            );

            return {
                ...state,
                display: { ...state.display, progressBar: { ...progressBarProps, percentage: 0 } },
            };
        }
        case 'UPDATE_PROGRESS_BAR_PERCENTAGE': {
            if (!state.display?.progressBar) {
                return state;
            }

            const percentage = action.payload;

            return {
                ...state,
                display: {
                    ...state.display,
                    progressBar: { ...state.display.progressBar, percentage },
                },
            };
        }
        case 'CLEAR_DISPLAY': {
            return { ...state, display: null };
        }
        default: {
            return state;
        }
    }
};

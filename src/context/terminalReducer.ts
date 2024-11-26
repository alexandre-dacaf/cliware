import { TerminalState, TerminalAction, HistoryGroup } from 'types';

export const initialTerminalState: TerminalState = {
    commandArgs: null,
    commandBlueprint: null,
    currentHistoryGroupId: null,
    printHistory: [],
    display: null,
};

export const terminalReducer = (state: TerminalState, action: TerminalAction): TerminalState => {
    switch (action.type) {
        case 'STANDBY': {
            return {
                ...state,
                commandArgs: null,
                commandBlueprint: null,
                display: null,
                currentHistoryGroupId: null,
            };
        }
        case 'SET_COMMAND_ARGS': {
            return { ...state, commandArgs: action.payload };
        }
        case 'SET_COMMAND_BLUEPRINT': {
            return { ...state, commandBlueprint: action.payload };
        }
        case 'CREATE_NEW_HISTORY_GROUP': {
            const currentGroupId = action.payload.currentGroupId;

            if (currentGroupId !== state.currentHistoryGroupId) {
                return state;
            }

            const newGroupId = action.payload.newGroupId;
            const initialEntries = action.payload.entries;
            const initialEntriesArray = Array.isArray(initialEntries)
                ? initialEntries
                : [initialEntries];

            const newHistoryGroup: HistoryGroup = { id: newGroupId, entries: initialEntriesArray };
            const history = state.printHistory;

            return {
                ...state,
                currentHistoryGroupId: newGroupId,
                printHistory: [...history, newHistoryGroup],
            };
        }
        case 'ADD_ENTRY_TO_TERMINAL_HISTORY': {
            const currentGroupId = state.currentHistoryGroupId;

            if (!currentGroupId) {
                return state;
            }

            // Makes sure the dispatcher matches the groupId
            const payloadCurrentGroupId = action.payload.currentGroupId;

            if (payloadCurrentGroupId !== currentGroupId) {
                return state;
            }

            // Gets whole printHistory, made of HistoryGroup entries { id: string, entries: entries: HistoryEntry[] }
            const history = state.printHistory;

            // Gets the currentGroup, checks if it exists and if it has an entries property array
            const currentGroup = history.find((historyGroup) => historyGroup.id === currentGroupId);

            if (!currentGroup || !currentGroup.entries) {
                return state;
            }

            // Entries can be HistoryEntry or HistoryEntry[]. Makes sure it's an array
            const payloadEntries = action.payload.entries;
            const payloadEntriesArray = Array.isArray(payloadEntries)
                ? payloadEntries
                : [payloadEntries];

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
        case 'SET_DISPLAY': {
            return { ...state, display: action.payload };
        }
        case 'CLEAR_DISPLAY': {
            return { ...state, display: null };
        }
        default: {
            return state;
        }
    }
};

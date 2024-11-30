import { blueprint } from 'blueprints/blueprint';
import { ensureArray, parseCommandArguments } from 'services';
import { Command, History, Pipeline, Terminal } from 'types';

export const initialTerminalState: Terminal.TerminalState = {
    currentHistoryBlockId: null,
    printHistory: [],
    commandArgs: null,
    display: null,
};

export const terminalReducer = (
    state: Terminal.TerminalState,
    action: Terminal.TerminalAction
): Terminal.TerminalState => {
    const getIdleConsoleState = () => {
        return {
            ...state,
            currentHistoryBlockId: null,
            commandArgs: null,
            display: null,
        };
    };

    switch (action.type) {
        case 'SET_IDLE_CONSOLE': {
            return getIdleConsoleState();
        }
        case 'START_NEW_COMMAND': {
            const { currentBlockId, newGroupId, consoleInput } = action.payload;

            // Check if the current block ID matches the state's current history block ID
            if (currentBlockId !== state.currentHistoryBlockId) return state;

            const commandArgs: Command.Args = parseCommandArguments(consoleInput);
            const baseCommand = commandArgs.baseCommand;

            // Check if the command exists in the blueprint
            const commandBlueprint = blueprint[baseCommand];

            // Initialize history entries with the user's input command
            const entries: History.HistoryEntry[] = [
                { type: 'text', content: { color: 'blue', text: `> ${consoleInput}` } },
            ];

            if (!commandBlueprint) {
                // If the command is not found, add an error message to the history entries
                entries.push({
                    type: 'text',
                    content: {
                        color: 'red',
                        text: `Command '${baseCommand}' not found.`,
                    },
                });

                // Create a new history group with the error message
                const newHistoryGroup = { id: newGroupId, entries };
                const history = state.printHistory;

                return {
                    ...getIdleConsoleState(),
                    printHistory: [...history, newHistoryGroup],
                };
            }

            const newHistoryGroup = { id: newGroupId, entries };
            const history = state.printHistory;

            return {
                ...state,
                currentHistoryBlockId: newGroupId,
                printHistory: [...history, newHistoryGroup],
                commandArgs,
            };
        }
        case 'LOG_HISTORY_ENTRY': {
            const currentBlockId = state.currentHistoryBlockId;
            if (!currentBlockId) return state;

            // Makes sure the dispatcher matches the groupId
            const payloadCurrentBlockId = action.payload.currentBlockId;
            if (payloadCurrentBlockId !== currentBlockId) return state;

            const history = state.printHistory;

            // Gets the currentBlock, checks if it exists and if it has an entries property array
            const currentBlock = history.find((historyBlock) => historyBlock.id === currentBlockId);
            if (!currentBlock) return state;

            // Entries can be History.HistoryEntry or History.HistoryEntry[]. Makes sure it's an array
            const payloadEntries = action.payload.entries;
            const payloadEntriesArray = ensureArray(payloadEntries);

            // Inserts all payload entries at the end of the currentBlock.entries array
            const newHistoryGroup = {
                ...currentBlock,
                entries: [...currentBlock.entries, ...payloadEntriesArray],
            };

            // Gets the remaining HistoryGroups in printHistory that are not the currentBlock
            const remainingGroups = history.filter(
                (historyBlock) => historyBlock.id !== currentBlockId
            );

            return {
                ...state,
                printHistory: [...remainingGroups, newHistoryGroup],
            };
        }
        case 'SET_MESSAGE_TEXT': {
            return { ...state, display: { ...state.display, text: action.payload } };
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
            if (!state.display?.progressBar) return state;

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

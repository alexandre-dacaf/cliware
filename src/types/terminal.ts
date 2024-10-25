import { CommandArgs, TaskStream, TaskKey } from './base';
import { CommandBlueprint } from './tasks';

export interface HistoryEntry {
    type: 'command' | 'input' | 'output' | 'error';
    content: string | JSX.Element;
}
export interface TerminalState {
    commandArgs: CommandArgs | null;
    commandBlueprint: CommandBlueprint | null;
    printHistory: HistoryEntry[];
    display: string | null;
}

export type TerminalAction =
    | { type: 'STANDBY' }
    | { type: 'SET_COMMAND_ARGS'; payload: CommandArgs }
    | { type: 'SET_COMMAND_BLUEPRINT'; payload: CommandBlueprint }
    | { type: 'ADD_OUTPUT_TO_TERMINAL_HISTORY'; payload: HistoryEntry | HistoryEntry[] }
    | { type: 'SET_TRANSIENT_OUTPUT'; payload: string }
    | { type: 'CLEAR_TRANSIENT_OUTPUT' };

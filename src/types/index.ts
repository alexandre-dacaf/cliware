export interface Blueprint {
    [command: string]: Command.Blueprint;
}

export namespace Task {
    export type Task = Prompt.PromptTask | Action.ActionTask;

    export type TaskId = string;

    export type TaskType = 'prompt' | 'action';

    export interface BaseTask {
        type: TaskType;
        next?: NextTask;
    }

    export type NextTask = string | ((context: Pipeline.Context) => string);
}

export namespace Prompt {
    export type PromptTask =
        | TextPrompt
        | TogglePrompt
        | SelectPrompt
        | MultiselectPrompt
        | NumberPrompt
        | ListPrompt
        | DatePrompt
        | AutoCompletePrompt
        | PasswordPrompt;

    export interface BasePrompt extends Task.BaseTask {
        type: 'prompt';
        message: string;
        promptType: PromptType;
        required?: boolean;
        validate?: ValidateFunction;
    }

    export type PromptType =
        | 'text'
        | 'toggle'
        | 'select'
        | 'multiselect'
        | 'number'
        | 'list'
        | 'date'
        | 'autocomplete'
        | 'password';

    export interface TextPrompt extends BasePrompt {
        promptType: 'text';
        default?: string;
        trim?: boolean;
        mask?: Mask;
        placeholder?: string;
    }

    export interface TogglePrompt extends BasePrompt {
        promptType: 'toggle';
        trueLabel?: string;
        falseLabel?: string;
        default?: boolean;
    }

    export interface SelectPrompt extends BasePrompt {
        promptType: 'select';
        choices: Choice[] | ChoiceFunction;
        default?: any;
    }

    export interface MultiselectPrompt extends BasePrompt {
        promptType: 'multiselect';
        choices: Choice[] | ChoiceFunction;
        default?: any;
    }

    export interface NumberPrompt extends BasePrompt {
        promptType: 'number';
        max?: number;
        min?: number;
        step?: number;
        float?: boolean;
        decimals?: number;
        default?: number;
        placeholder?: string;
    }

    export interface ListPrompt extends BasePrompt {
        promptType: 'list';
        separator?: string;
        trim?: boolean;
        placeholder?: string;
    }

    export interface DatePrompt extends BasePrompt {
        promptType: 'date';
        default?: string;
        placeholder?: string;
    }

    export interface AutoCompletePrompt extends BasePrompt {
        promptType: 'autocomplete';
        suggestions: string[];
        itemsPerPage?: number;
        default?: string;
        placeholder?: string;
    }

    export interface PasswordPrompt extends BasePrompt {
        promptType: 'password';
        placeholder?: string;
    }

    export interface Choice {
        value?: any;
        label: string;
        hint?: string;
    }

    export type ChoiceFunction = (context: Pipeline.Context) => Promise<Choice[]> | Choice[];

    export type ValidateFunction = (response: any) => boolean | string;

    export type Mask = MaskTemplate | MaskFunction;

    export type MaskTemplate =
        | 'cpf'
        | 'cnpj'
        | 'phone'
        | 'cep'
        | 'date'
        | 'time'
        | 'datetime'
        | 'credit-card'
        | 'currency-BRL'
        | 'currency-USD'
        | 'currency-EUR'
        | 'currency-GBP'
        | 'currency-JPY'
        | 'ipv4-address'
        | 'ipv6-address'
        | 'hex-color';

    export type MaskFunction = (value: string) => string;
}

export namespace Action {
    export interface ActionTask extends Task.BaseTask {
        type: 'action';
        actionFunction: ActionFunction;
    }

    export type ActionFunction = (context: Pipeline.Context) => Promise<any> | any;
}

export namespace Command {
    export interface Args {
        baseCommand: string;
        args: string[];
        options: { [key: string]: string | string[] | boolean };
        flags: string[];
    }

    export interface Blueprint {
        entrypoint: string;
        pipeline: Pipeline.Blueprint;
    }
}

export namespace App {
    export interface AppState {
        terminalList: TerminalType[];
        currentTerminalId: string | null;
        currentTerminalState: 'active' | 'focused';
        terminalColumns: number;
    }

    export interface TerminalType {
        id: string;
    }

    export type AppAction =
        | { type: 'CREATE_TERMINAL'; payload: CreateTerminalPayload }
        | { type: 'DELETE_TERMINAL'; payload: DeleteTerminalPayload }
        | { type: 'ACTIVATE_TERMINAL' }
        | { type: 'DEACTIVATE_TERMINAL' }
        | { type: 'SELECT_NEXT_TERMINAL' }
        | { type: 'SELECT_PREVIOUS_TERMINAL' }
        | { type: 'CHANGE_TERMINAL_COLUMNS'; payload: number };

    export interface CreateTerminalPayload {
        beforeId: string;
        afterId: string | null;
        newTerminalId: string;
    }

    export interface DeleteTerminalPayload {
        terminalToDeleteId: string;
    }
}

export namespace Terminal {
    export interface TerminalState {
        currentHistoryBlockId: History.HistoryBlockId | null;
        printHistory: History.HistoryBlock[];
        commandArgs: Command.Args | null;
        display: MessagePanel.Display | null;
    }

    export type TerminalAction =
        | { type: 'SET_IDLE_CONSOLE' }
        | {
              type: 'START_NEW_COMMAND';
              payload: StartNewCommandPayload;
          }
        | {
              type: 'FINISH_TASK';
              payload: { currentTaskId: Task.TaskId; next?: Task.NextTask; data: any };
          }
        | {
              type: 'GO_TO_PREVIOUS_TASK';
          }
        | {
              type: 'LOG_HISTORY_ENTRY';
              payload: LogHistoryEntryPayload;
          }
        | { type: 'SET_MESSAGE_TEXT'; payload: Text.RichText | null }
        | { type: 'SET_PROGRESS_BAR_STYLE'; payload: MessagePanel.ProgressBarStyle | null }
        | { type: 'UPDATE_PROGRESS_BAR_PERCENTAGE'; payload: number }
        | { type: 'CLEAR_DISPLAY' };

    export interface StartNewCommandPayload {
        currentBlockId: History.HistoryBlockId | null;
        newGroupId: string;
        consoleInput: string;
    }
    export interface LogHistoryEntryPayload {
        currentBlockId: History.HistoryBlockId | null;
        entries: History.HistoryEntry | History.HistoryEntry[];
    }
}

export namespace Pipeline {
    export interface Blueprint {
        [taskId: Task.TaskId]: Task.Task;
    }

    export interface Context {
        currentTaskId: Task.TaskId | null;
        pipelineData: PipelineData;
        commandArgs: Command.Args | null;
        hooks: {
            messagePanel: Hooks.UseMessagePanelMethods;
            historyLog: Hooks.UseHistoryLoggerMethods;
            clipboard: Hooks.UseClipboardMethods;
            fileDownload: Hooks.UseFileDowloaderMethods;
            appDispatcher: Hooks.UseAppDispatcherMethods;
        };
    }

    export interface PipelineData {
        [taskId: Task.TaskId]: any;
    }
}

export namespace History {
    export interface HistoryBlock {
        id: HistoryBlockId;
        entries: HistoryEntry[];
    }

    export type HistoryBlockId = string;

    export type HistoryEntry = TextHistoryEntry | JsonHistoryEntry | TableHistoryEntry;

    export interface BaseHistoryEntry {
        type: string;
        content: any;
    }

    export interface TextHistoryEntry extends BaseHistoryEntry {
        type: 'text';
        content: Text.RichText;
    }

    export interface JsonHistoryEntry extends BaseHistoryEntry {
        type: 'json';
        content: object;
    }

    export interface TableHistoryEntry extends BaseHistoryEntry {
        type: 'table';
        content: Table.TableContent;
    }
}

export namespace MessagePanel {
    export interface Display {
        text?: Text.RichText | null;
        progressBar?: ProgressBar | null;
    }

    export interface ProgressBar {
        percentage: number;
        color?: Color.ColorName;
    }

    export interface ProgressBarStyle {
        color?: Color.ColorName;
    }
}

export namespace Text {
    export type RichText = RichTextSpan | RichTextSpan[];

    export interface RichTextSpan {
        color?: Color.ColorName;
        text?: string;
        spinner?: Spinner;
    }

    export interface Spinner {
        name: SpinnerName;
        interval?: number;
    }

    export type SpinnerName =
        | 'dots'
        | 'dots2'
        | 'dots3'
        | 'dots4'
        | 'dots5'
        | 'dots6'
        | 'dots7'
        | 'dots8'
        | 'dots9'
        | 'line'
        | 'arc'
        | 'circleHalves'
        | 'ellipsis';
}

export namespace Table {
    export type TableContent = {
        columns: TableColumn[];
        data: TableData[];
    };

    export type TableColumn = {
        key: string;
        header: string;
    };

    export type TableData = Record<string, any>;
}

export namespace Color {
    export interface Theme {
        palette: Palette;
    }

    export type Palette = Record<ColorName, string>;

    export type ColorName =
        | 'blue'
        | 'blue-dark'
        | 'cyan'
        | 'cyan-dark'
        | 'cyan-light'
        | 'teal'
        | 'teal-dark'
        | 'teal-light'
        | 'blue-light'
        | 'green'
        | 'green-dark'
        | 'green-light'
        | 'yellow'
        | 'yellow-dark'
        | 'yellow-light'
        | 'orange'
        | 'orange-dark'
        | 'orange-light'
        | 'red'
        | 'red-dark'
        | 'red-light'
        | 'pink'
        | 'pink-dark'
        | 'pink-light'
        | 'purple'
        | 'purple-dark'
        | 'purple-light'
        | 'neutral-100'
        | 'neutral-200'
        | 'neutral-300'
        | 'neutral-400'
        | 'neutral-500'
        | 'neutral-600'
        | 'neutral-700'
        | 'neutral-800'
        | 'neutral-900'
        | 'neutral-light';
}

export namespace Hooks {
    export interface UseMessagePanelMethods {
        setMessageText: (text: Text.RichText | null) => void;
        setMessageAlert: (text: string) => void;
        setProgressBarStyle: (style: MessagePanel.ProgressBarStyle | null) => void;
        updateProgressBarPercentage: (percentage: number) => void;
        clearDisplay: () => void;
    }

    export interface UseHistoryLoggerMethods {
        log: (entries: History.HistoryEntry | History.HistoryEntry[]) => void;
        logRichText: (content: Text.RichText) => void;
        logPromptResponse: (message: string) => void;
        logSuccess: (message: string) => void;
        logAlert: (message: string) => void;
        logError: (error: any) => void;
        logTable: (tableContent: Table.TableContent) => void;
        logJson: (json: object) => void;
    }

    export interface UseClipboardMethods {
        copyToClipboard: (text: string) => void;
    }

    export interface UseFileDowloaderMethods {
        downloadAsTxt: (filename: string, content: string) => void;
        downloadAsCsv: (
            filename: string,
            tableContent: Table.TableContent,
            separator?: string
        ) => void;
        downloadAsJson: (filename: string, json: object) => void;
    }

    export interface UseAppDispatcherMethods {
        changeTerminalColumns: (payload: number) => void;
        createTerminal: () => void;
        deleteTerminal: (terminalId: string) => void;
        deleteCurrentTerminal: () => void;
        activateTerminal: () => void;
        deactivateTerminal: () => void;
        selectNextTerminal: () => void;
        selectPreviousTerminal: () => void;
    }
}

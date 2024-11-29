export interface Blueprint {
    [command: string]: Command.Blueprint;
}

export namespace Task {
    export type Task = Prompt.PromptTask | Action.ActionTask;

    export type TaskKey = string;

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
        choices: Choice[];
        default?: any;
    }

    export interface MultiselectPrompt extends BasePrompt {
        promptType: 'multiselect';
        choices: Choice[];
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

export namespace Pipeline {
    export interface Blueprint {
        [taskKey: Task.TaskKey]: Task.Task;
    }

    export interface Context {
        currentTaskKey: Task.TaskKey;
        taskBreadcrumbs: Task.TaskKey[];
        pipelineData: PipelineData;
        pipelineBlueprint: Blueprint;
        commandArgs: Command.Args | null;
        messagePanel: Hooks.UseMessagePanelMethods;
        history: Hooks.UseHistoryLoggerMethods;
        clipboard: Hooks.UseClipboardMethods;
        fileDownload: Hooks.UseFileDowloaderMethods;
        appDispatcher: Hooks.UseAppDispatcherMethods;
    }

    export interface PipelineData {
        [taskKey: Task.TaskKey]: any;
    }
}

export namespace Command {
    export interface Args {
        command: string;
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
        commandArgs: Command.Args | null;
        command: Command.Blueprint | null;
        currentHistoryGroupId: History.HistoryBlockId;
        printHistory: History.HistoryBlock[];
        display: MessagePanel.Display | null;
    }

    export type TerminalAction =
        | { type: 'SET_IDLE_CONSOLE' }
        | {
              type: 'START_NEW_COMMAND';
              payload: StartNewCommandPayload;
          }
        | {
              type: 'COMMAND_NOT_FOUND';
              payload: CommandNotFoundPayload;
          }
        | {
              type: 'LOG_HISTORY_ENTRY';
              payload: LogHistoryEntryPayload;
          }
        | { type: 'SET_MESSAGE_TEXT'; payload: string | null }
        | { type: 'SET_SPINNER'; payload: MessagePanel.Spinner | null }
        | { type: 'SET_PROGRESS_BAR_STYLE'; payload: MessagePanel.ProgressBarStyle | null }
        | { type: 'UPDATE_PROGRESS_BAR_PERCENTAGE'; payload: number }
        | { type: 'CLEAR_DISPLAY' };

    export interface StartNewCommandPayload {
        currentGroupId: History.HistoryBlockId;
        newGroupId: string;
        commandString: string;
        command: Command.Blueprint;
        commandArgs: Command.Args;
    }

    export interface CommandNotFoundPayload {
        currentGroupId: History.HistoryBlockId;
        newGroupId: string;
        commandString: string;
    }

    export interface LogHistoryEntryPayload {
        currentGroupId: History.HistoryBlockId;
        entries: History.HistoryEntry | History.HistoryEntry[];
    }
}

export namespace History {
    export interface HistoryBlock {
        id: HistoryBlockId;
        entries: HistoryEntry[];
    }

    export type HistoryBlockId = string | null;

    export type HistoryEntry = TextHistoryEntry | JsonHistoryEntry | TableHistoryEntry;

    export interface BaseHistoryEntry {
        type: string;
        content: any;
    }

    export interface TextHistoryEntry extends BaseHistoryEntry {
        type: 'text';
        content: Content.Text.RichTextLine;
    }

    export interface JsonHistoryEntry extends BaseHistoryEntry {
        type: 'json';
        content: object;
    }

    export interface TableHistoryEntry extends BaseHistoryEntry {
        type: 'table';
        content: Content.Table.TableContent;
    }
}

export namespace MessagePanel {
    export interface Display {
        text?: string | null;
        spinner?: Spinner | null;
        progressBar?: ProgressBarProps | null;
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
        | 'circleHalves';

    export interface ProgressBarProps {
        percentage: number;
        trackStyle?: React.CSSProperties;
        barStyle?: React.CSSProperties;
        animationKeyframes?: string;
        color?: Content.Palette.ColorName;
    }

    export interface ProgressBarStyle {
        trackStyle?: React.CSSProperties;
        barStyle?: React.CSSProperties;
        animationKeyframes?: string;
        color?: Content.Palette.ColorName;
    }
}

export namespace Content {
    export namespace Text {
        export type RichTextLine = RichTextSpan | RichTextSpan[];

        export interface RichTextSpan {
            color?: Content.Palette.ColorName;
            text: string;
        }
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

    export namespace Palette {
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
}

export namespace Hooks {
    export interface UseMessagePanelMethods {
        setMessageText: (text: string) => void;
        setSpinner: (spinner: MessagePanel.Spinner) => void;
        setProgressBarStyle: (style: MessagePanel.ProgressBarStyle | null) => void;
        updateProgressBarPercentage: (percentage: number) => void;
        clearDisplay: () => void;
    }

    export interface UseHistoryLoggerMethods {
        print: (entries: History.HistoryEntry | History.HistoryEntry[]) => void;
        printText: (content: Content.Text.RichTextLine) => void;
        printCommand: (message: string) => void;
        printCommandNotFound: (commandString: string) => void;
        printPromptResponse: (message: string) => void;
        printSuccess: (message: string) => void;
        printAlert: (message: string) => void;
        printError: (error: any) => void;
        printTable: (tableContent: Content.Table.TableContent) => void;
        printJson: (json: object) => void;
    }

    export interface UseClipboardMethods {
        copyToClipboard: (text: string) => void;
    }

    export interface UseFileDowloaderMethods {
        downloadAsTxt: (filename: string, content: string) => void;
        downloadAsCsv: (
            filename: string,
            tableContent: Content.Table.TableContent,
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

export namespace Blueprint {
    export interface Blueprint {
        [command: string]: Command;
    }

    export interface Command {
        entrypoint: string;
        pipeline: Pipeline;
    }

    export interface Pipeline {
        [taskKey: TaskKey]: Task.Task;
    }

    export type TaskKey = string;
}

export namespace Task {
    export type Task = Prompt.PromptTask | Action.ActionTask;

    export type TaskType = 'prompt' | 'action';

    export interface BaseTask {
        type: TaskType;
        next?: NextTask;
    }

    export type NextTask = string | ((context: PipelineContext.PipelineContext) => string);
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

    export type ActionFunction = (context: PipelineContext.PipelineContext) => Promise<any> | any;
}

export namespace PipelineContext {
    export interface PipelineContext {
        currentTaskKey: Blueprint.TaskKey;
        taskBreadcrumbs: Blueprint.TaskKey[];
        pipelineData: PipelineData;
        pipeline: Blueprint.Pipeline;
        commandArgs: Command.CommandArgs | null;
        printer: Hooks.PrinterInterface;
        appDispatcher: Hooks.AppDispatcherInterface;
    }

    export interface PipelineData {
        [taskKey: Blueprint.TaskKey]: any;
    }
}

export namespace Command {
    export interface CommandArgs {
        command: string;
        args: string[];
        options: { [key: string]: string | string[] | boolean };
        flags: string[];
    }
}

export namespace History {
    export interface HistoryGroup {
        id: HistoryGroupId;
        entries: HistoryEntry[];
    }

    export type HistoryGroupId = string | null;

    export type HistoryEntry = TextHistoryEntry | JsonHistoryEntry | TableHistoryEntry;

    export interface BaseHistoryEntry {
        type: string;
        content: any;
    }

    export interface TextHistoryEntry extends BaseHistoryEntry {
        type: 'text';
        content: Content.Text.TextSpan | Content.Text.TextSpan[];
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
        spinner?: SpinnerProps | null;
        progressBar?: ProgressBarProps | null;
    }

    export interface SpinnerProps {
        frames: string[];
        interval: number;
    }

    export interface PrinterDisplayProps {
        text?: string;
        spinnerConfig?: SpinnerConfig;
        progressBar?: ProgressBarProps;
    }

    export type DefaultSpinnerNames =
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

    export interface SpinnerConfig {
        name?: DefaultSpinnerNames;
        frames?: string[];
        interval?: number;
    }

    export interface ProgressBarProps {
        percentage: number;
        trackStyle?: React.CSSProperties;
        barStyle?: React.CSSProperties;
        animationKeyframes?: string;
        color?: Content.Color.PaletteColor;
    }

    export interface ProgressBarStyle {
        trackStyle?: React.CSSProperties;
        barStyle?: React.CSSProperties;
        animationKeyframes?: string;
        color?: Content.Color.PaletteColor;
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
        commandArgs: Command.CommandArgs | null;
        command: Blueprint.Command | null;
        currentHistoryGroupId: History.HistoryGroupId;
        printHistory: History.HistoryGroup[];
        display: MessagePanel.Display | null;
    }

    export type TerminalAction =
        | { type: 'STANDBY' }
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
        | { type: 'SET_DISPLAY_TEXT'; payload: string | null }
        | { type: 'SET_DISPLAY_SPINNER'; payload: MessagePanel.SpinnerProps | null }
        | { type: 'SET_PROGRESS_BAR_STYLE'; payload: MessagePanel.ProgressBarStyle | null }
        | { type: 'UPDATE_PROGRESS_BAR_PERCENTAGE'; payload: number }
        | { type: 'CLEAR_DISPLAY' };

    export interface StartNewCommandPayload {
        currentGroupId: History.HistoryGroupId;
        newGroupId: string;
        commandString: string;
        command: Blueprint.Command;
        commandArgs: Command.CommandArgs;
    }

    export interface CommandNotFoundPayload {
        currentGroupId: History.HistoryGroupId;
        newGroupId: string;
        commandString: string;
    }

    export interface LogHistoryEntryPayload {
        currentGroupId: History.HistoryGroupId;
        entries: History.HistoryEntry | History.HistoryEntry[];
    }
}

export namespace Content {
    export namespace Text {
        export interface TextSpan {
            color?: Content.Color.PaletteColor;
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

    export namespace Color {
        export type PaletteColor =
            | 'blue'
            | 'blue-dark'
            | 'blue-light'
            | 'green'
            | 'green-dark'
            | 'green-light'
            | 'red'
            | 'red-dark'
            | 'red-light'
            | 'yellow'
            | 'yellow-dark'
            | 'yellow-light'
            | 'purple'
            | 'purple-dark'
            | 'purple-light'
            | 'orange'
            | 'orange-dark'
            | 'orange-light'
            | 'teal'
            | 'teal-dark'
            | 'teal-light'
            | 'cyan'
            | 'cyan-dark'
            | 'cyan-light'
            | 'pink'
            | 'pink-dark'
            | 'pink-light'
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
    export interface PrinterInterface {
        setDisplayText: (text: string) => void;
        setDisplaySpinner: (config: MessagePanel.SpinnerConfig) => void;
        setProgressBarStyle: (style: MessagePanel.ProgressBarStyle | null) => void;
        updateProgressBarPercentage: (percentage: number) => void;
        clearDisplay: () => void;
        print: (entries: History.HistoryEntry | History.HistoryEntry[]) => void;
        printText: (content: Content.Text.TextSpan | Content.Text.TextSpan[]) => void;
        printCommand: (message: string) => void;
        printCommandNotFound: (commandString: string) => void;
        printPromptResponse: (message: string) => void;
        printSuccess: (message: string) => void;
        printAlert: (message: string) => void;
        printError: (error: any) => void;
        printTable: (tableContent: Content.Table.TableContent) => void;
        printJson: (json: object) => void;
        copyToClipboard: (text: string) => void;
        downloadAsTxt: (filename: string, content: string) => void;
        downloadAsCsv: (
            filename: string,
            tableContent: Content.Table.TableContent,
            separator?: string
        ) => void;
        downloadAsJson: (filename: string, json: object) => void;
    }

    export interface AppDispatcherInterface {
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

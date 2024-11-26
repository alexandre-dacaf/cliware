//#region Base
export type TaskType = 'prompt' | 'action' | 'output';

export type TaskKey = string;

export type NextTask = string | ((context: PipelineContext) => string);
export interface BaseTask {
    type: TaskType;
    next?: NextTask;
}

export interface CommandArgs {
    command: string;
    args: string[];
    options: { [key: string]: string | string[] | boolean };
    flags: string[];
}

export interface PipelineData {
    [taskKey: TaskKey]: any;
}
//#endregion

//#region Tasks
export type Task = PromptTask | ActionTask;

export interface Pipeline {
    [taskKey: TaskKey]: Task;
}

export interface Command {
    entrypoint: string;
    pipeline: Pipeline;
}

export interface Blueprint {
    [command: string]: Command;
}
//#endregion

//#region Actions
export interface PipelineContext {
    currentTaskKey: TaskKey;
    taskBreadcrumbs: TaskKey[];
    pipelineData: PipelineData;
    pipeline: Pipeline;
    commandArgs: CommandArgs | null;
    printer: PrinterInterface;
    appDispatcher: AppDispatcherInterface;
}

export type ActionFunction = (context: PipelineContext) => Promise<any> | any;

export interface ActionTask extends BaseTask {
    type: 'action';
    actionFunction: ActionFunction;
}
//#endregion

//#region Prompts
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

export interface Choice {
    value?: any;
    label: string;
    hint?: string;
}

export type ValidateFunction = (response: any) => boolean | string;

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
export type Mask = MaskTemplate | MaskFunction;

export interface BasePrompt extends BaseTask {
    type: 'prompt';
    message: string;
    promptType: PromptType;
    required?: boolean;
    validate?: ValidateFunction;
}

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
//#endregion

//#region Context

// App
export interface TerminalType {
    id: string;
}

export interface AppState {
    terminalList: TerminalType[];
    currentTerminalId: string | null;
    currentTerminalState: 'active' | 'focused';
    terminalColumns: number;
}

export interface CreateTerminalPayload {
    beforeId: string;
    afterId: string | null;
    newTerminalId: string;
}

export interface DeleteTerminalPayload {
    terminalToDeleteId: string;
}

export type AppAction =
    | { type: 'CREATE_TERMINAL'; payload: CreateTerminalPayload }
    | { type: 'DELETE_TERMINAL'; payload: DeleteTerminalPayload }
    | { type: 'ACTIVATE_TERMINAL' }
    | { type: 'DEACTIVATE_TERMINAL' }
    | { type: 'SELECT_NEXT_TERMINAL' }
    | { type: 'SELECT_PREVIOUS_TERMINAL' }
    | { type: 'CHANGE_TERMINAL_COLUMNS'; payload: number };

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

// Terminal
export interface PrinterInterface {
    print: (entries: HistoryEntry | HistoryEntry[]) => void;
    printText: (content: TextSpan | TextSpan[]) => void;
    printCommand: (message: string) => void;
    printCommandNotFound: (commandString: string) => void;
    printPromptResponse: (message: string) => void;
    printSuccess: (message: string) => void;
    printAlert: (message: string) => void;
    printError: (error: any) => void;
    printTable: (tableContent: TableEntryContent) => void;
    printJson: (json: object) => void;
    copyToClipboard: (text: string) => void;
    downloadAsTxt: (filename: string, content: string) => void;
    downloadAsCsv: (filename: string, tableContent: TableEntryContent, separator?: string) => void;
    downloadAsJson: (filename: string, json: object) => void;
    display: (output: string, spinner?: GenerateSpinnerConfigProps) => void;
    clearDisplay: () => void;
}

export interface SpinnerProps {
    frames: string[];
    interval: number;
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
    | 'arc2'
    | 'circleHalves';

export interface GenerateSpinnerConfigProps {
    name?: DefaultSpinnerNames;
    frames?: string[];
    interval?: number;
}

export type HistoryEntry = TextEntry | JsonEntry | TableEntry;

export interface BaseEntry {
    type: string;
    content: any;
}

export interface TextEntry extends BaseEntry {
    type: 'text';
    content: TextSpan | TextSpan[];
}

export interface TextSpan {
    color?: TextSpanColor;
    text: string;
}

export type TextSpanColor =
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

export interface JsonEntry extends BaseEntry {
    type: 'json';
    content: object;
}

export interface TableEntry extends BaseEntry {
    type: 'table';
    content: TableEntryContent;
}

export type TableEntryContent = {
    columns: TableColumn[];
    data: TableData[];
};

export type TableColumn = {
    key: string;
    header: string;
};

export type TableData = Record<string, any>;

export type HistoryGroupId = string | null;

export interface HistoryGroup {
    id: HistoryGroupId;
    entries: HistoryEntry[];
}

export interface Display {
    output: string;
    spinner: SpinnerProps | null;
}

export interface TerminalState {
    commandArgs: CommandArgs | null;
    command: Command | null;
    currentHistoryGroupId: HistoryGroupId;
    printHistory: HistoryGroup[];
    display: Display | null;
}

export type TerminalAction =
    | { type: 'STANDBY' }
    | {
          type: 'START_NEW_COMMAND';
          payload: {
              currentGroupId: HistoryGroupId;
              newGroupId: string;
              commandString: string;
              command: Command;
              commandArgs: CommandArgs;
          };
      }
    | {
          type: 'COMMAND_NOT_FOUND';
          payload: { currentGroupId: HistoryGroupId; newGroupId: string; commandString: string };
      }
    | {
          type: 'ADD_ENTRY_TO_TERMINAL_HISTORY';
          payload: { currentGroupId: HistoryGroupId; entries: HistoryEntry | HistoryEntry[] };
      }
    | { type: 'SET_DISPLAY'; payload: Display }
    | { type: 'CLEAR_DISPLAY' };
//#endregion

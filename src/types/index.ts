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

export interface PipelineBlueprint {
    [taskKey: TaskKey]: Task;
}

export interface CommandBlueprint {
    entrypoint: string;
    pipeline: PipelineBlueprint;
}

export interface Blueprint {
    [command: string]: CommandBlueprint;
}
//#endregion

//#region Actions
export interface PipelineContext {
    currentTaskKey: TaskKey;
    taskKeyBreadcrumbs: TaskKey[];
    pipelineData: PipelineData;
    pipelineBlueprint: PipelineBlueprint;
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
    createHistoryGroup: (initialEntries?: HistoryEntry | HistoryEntry[]) => void;
    print: (entries: HistoryEntry | HistoryEntry[]) => void;
    printCommand: (message: string) => void;
    printInput: (message: string) => void;
    printOutput: (output: string) => void;
    printError: (error: any) => void;
    printTable: (tableContent: TableContent) => void;
    printJson: (jsonString: string) => void;
    copyToClipboard: (text: string) => void;
    downloadAsTxt: (filename: string, content: string) => void;
    downloadAsCsv: (filename: string, tableContent: TableContent, separator?: string) => void;
    downloadAsJson: (filename: string, jsonContent: object) => void;
    display: (output: string) => void;
    clearDisplay: () => void;
}

export interface BaseEntry {
    type: string;
    content: any;
}

export interface StringEntry extends BaseEntry {
    type: 'command' | 'input' | 'output' | 'error' | 'json';
    content: string;
}

export type TableColumn = {
    key: string;
    header: string;
};

export type TableData = Record<string, any>;

export type TableContent = {
    columns: TableColumn[];
    data: TableData[];
};

export interface TableEntry extends BaseEntry {
    type: 'table';
    content: TableContent;
}

export type HistoryEntry = StringEntry | TableEntry;

export type HistoryGroupId = string | null;

export interface HistoryGroup {
    id: HistoryGroupId;
    entries: HistoryEntry[];
}

export interface TerminalState {
    commandArgs: CommandArgs | null;
    commandBlueprint: CommandBlueprint | null;
    currentHistoryGroupId: HistoryGroupId;
    printHistory: HistoryGroup[];
    display: string | null;
}

export type TerminalAction =
    | { type: 'STANDBY' }
    | { type: 'SET_COMMAND_ARGS'; payload: CommandArgs }
    | { type: 'SET_COMMAND_BLUEPRINT'; payload: CommandBlueprint }
    | {
          type: 'CREATE_NEW_HISTORY_GROUP';
          payload: {
              currentGroupId: HistoryGroupId;
              newGroupId: string;
              entries: HistoryEntry | HistoryEntry[];
          };
      }
    | {
          type: 'ADD_OUTPUT_TO_TERMINAL_HISTORY';
          payload: { currentGroupId: HistoryGroupId; entries: HistoryEntry | HistoryEntry[] };
      }
    | { type: 'SET_TRANSIENT_OUTPUT'; payload: string }
    | { type: 'CLEAR_TRANSIENT_OUTPUT' };
//#endregion

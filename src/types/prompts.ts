import { BaseTask } from './base';

export type PromptType = 'text' | 'toggle' | 'select' | 'multiselect' | 'number' | 'list' | 'date' | 'autocomplete' | 'password';

export interface Choice {
    value?: any;
    label: string;
}

export interface BasePrompt extends BaseTask {
    type: 'prompt';
    message: string;
    promptType: PromptType;
}

export interface TextPrompt extends BasePrompt {
    promptType: 'text';
}

export interface TogglePrompt extends BasePrompt {
    promptType: 'toggle';
    trueLabel?: string;
    falseLabel?: string;
}

export interface SelectPrompt extends BasePrompt {
    promptType: 'select';
    choices: Choice[];
}

export interface MultiselectPrompt extends BasePrompt {
    promptType: 'multiselect';
    choices: Choice[];
}

export interface NumberPrompt extends BasePrompt {
    promptType: 'number';
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
}

export interface ListPrompt extends BasePrompt {
    promptType: 'list';
    separator?: string;
    trim?: boolean;
}

export interface DatePrompt extends BasePrompt {
    promptType: 'date';
}

export type DateLimitFunction = (value: number) => number;
export type DateAdjustFunction = (amount: number) => void;
export type DateFocusFunction = () => void;
export interface DateKeyDownHandler {
    adjust: DateAdjustFunction;
    focusLeft: DateFocusFunction;
    focusRight: DateFocusFunction;
}

export interface AutoCompletePrompt extends BasePrompt {
    promptType: 'autocomplete';
    choices: Choice[];
    maxDisplayedOptions?: number;
}

export interface PasswordPrompt extends BasePrompt {
    promptType: 'password';
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

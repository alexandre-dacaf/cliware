import { BaseTask } from './base';

export type PromptType = 'text' | 'confirm' | 'select' | 'multiselect' | 'number' | 'list' | 'date' | 'autocomplete' | 'password';

export interface Choice {
    value?: string | number;
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

export interface ConfirmPrompt extends BasePrompt {
    promptType: 'confirm';
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
}

export interface DatePrompt extends BasePrompt {
    promptType: 'date';
}

export interface AutoCompletePrompt extends BasePrompt {
    promptType: 'autocomplete';
    choices: Choice[];
}

export interface PasswordPrompt extends BasePrompt {
    promptType: 'password';
}

export type PromptTask =
    | TextPrompt
    | ConfirmPrompt
    | SelectPrompt
    | MultiselectPrompt
    | NumberPrompt
    | ListPrompt
    | DatePrompt
    | AutoCompletePrompt
    | PasswordPrompt;

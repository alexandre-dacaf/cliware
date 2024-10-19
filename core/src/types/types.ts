import { TextPrompt } from "../components/prompts";

export type TaskType = "prompt" | "action" | "output";

export type PromptType = "text" | "confirm" | "select";

export type TaskKey = string;

export interface Choice {
    value?: string | number;
    label: string;
}

export interface BaseTask {
    type: TaskType;
    next?: string | ((pipelineData: PipelineData) => string);
}

export interface BasePromptTask extends BaseTask {
    type: "prompt";
    message: string;
    promptType: PromptType;
}

export interface TextPromptTask extends BasePromptTask {
    promptType: "text";
}

export interface ConfirmPromptTask extends BasePromptTask {
    promptType: "confirm";
    trueLabel?: string;
    falseLabel?: string;
}

export interface SelectPromptTask extends BasePromptTask {
    promptType: "select";
    choices: Choice[];
}

export type PromptTask = TextPromptTask | ConfirmPromptTask | SelectPromptTask;

export interface ActionTask extends BaseTask {
    type: "action";
    actionFunction: (taskKey: TaskKey, pipelineData: PipelineData) => Promise<any> | any;
}

export interface OutputTask extends BaseTask {
    type: "output";
    outputFunction: (pipelineData: PipelineData) => string | JSX.Element;
}

export type Task = PromptTask | ActionTask | OutputTask;

export interface PipelineData {
    [taskKey: TaskKey]: any;
}

export interface CommandPipeline {
    [taskKey: TaskKey]: Task;
}

export interface CommandConfig {
    [command: string]: {
        entrypoint: string;
        pipeline: CommandPipeline
    }
}

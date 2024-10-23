import { TextPrompt } from "../components/prompts";

export type TaskType = "prompt" | "action" | "output";

export type PromptType = "text" | "confirm" | "select" | "number";

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

export interface NumberPromptTask extends BasePromptTask {
    promptType: "number";
    max?: number;
    min?: number;
    step?: number;
    float?: boolean;
    decimals?: number;
}

export type PromptTask =
    | TextPromptTask
    | ConfirmPromptTask
    | SelectPromptTask
    | NumberPromptTask;

export interface ActionTask extends BaseTask {
    type: "action";
    actionFunction: (
        taskKey: TaskKey,
        pipelineData: PipelineData
    ) => Promise<any> | any;
}

export interface OutputTask extends BaseTask {
    type: "output";
    outputFunction: (pipelineData: PipelineData) => string | JSX.Element;
}

export type Task = PromptTask | ActionTask | OutputTask;

export type PipelineCmdData = {
    args: string[];
    flags: string[];
    options: Record<string, string>;
};

export type PipelineTermData = {
    terminalId: number;
};

export interface PipelineData {
    $terminal: PipelineTermData;
    $cmd: PipelineCmdData;
    $pipeline: { [taskKey: TaskKey]: any };
}

export interface CommandPipeline {
    [taskKey: TaskKey]: Task;
}

export interface CommandConfig {
    [command: string]: {
        entrypoint: string;
        pipeline: CommandPipeline;
    };
}

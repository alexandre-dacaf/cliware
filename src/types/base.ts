export type TaskType = 'prompt' | 'action' | 'output';

export type TaskKey = string;
export interface BaseTask {
    type: TaskType;
    next?: string | ((pipelineData: PipelineData) => string);
}

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

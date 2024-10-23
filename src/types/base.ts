export type TaskType = 'prompt' | 'action' | 'output';

export type TaskKey = string;
export interface BaseTask {
    type: TaskType;
    next?: string | ((pipelineData: PipelineData) => string);
}

export type PipelineDataTerm = {
    terminalId: number;
};

export type PipelineDataCmd = {
    command: string;
    args: string[];
    flags: string[];
    options: Record<string, string>;
};

export interface PipelineData {
    $terminal: PipelineDataTerm;
    $cmd: PipelineDataCmd;
    $responses: { [taskKey: TaskKey]: any };
}

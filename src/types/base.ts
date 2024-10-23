export type TaskType = 'prompt' | 'action' | 'output';

export type TaskKey = string;

export type NextTask = string | ((taskStream: TaskStream) => string);
export interface BaseTask {
    type: TaskType;
    next?: NextTask;
}

export type CommandArgs = {
    command: string;
    args: string[];
    flags: string[];
    options: Record<string, string>;
};

export interface TaskStream {
    [taskKey: TaskKey]: any;
}

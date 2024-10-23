import { TaskKey } from './base';
import { PromptTask } from './prompts';
import { ActionTask } from './actions';
import { OutputTask } from './outputs';

export type Task = PromptTask | ActionTask | OutputTask;

export interface CommandPipeline {
    [taskKey: TaskKey]: Task;
}

export interface CommandConfig {
    [command: string]: {
        entrypoint: string;
        pipeline: CommandPipeline;
    };
}

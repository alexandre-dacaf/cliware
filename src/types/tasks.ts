import { TaskKey } from './base';
import { PromptTask } from './prompts';
import { ActionTask } from './actions';
import { OutputTask } from './outputs';

export type Task = PromptTask | ActionTask | OutputTask;

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

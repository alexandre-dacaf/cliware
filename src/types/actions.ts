import { BaseTask, TaskKey, PipelineData } from './base';

export interface ActionTask extends BaseTask {
    type: 'action';
    actionFunction: (taskKey: TaskKey, pipelineData: PipelineData) => Promise<any> | any;
}

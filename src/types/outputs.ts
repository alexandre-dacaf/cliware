import { BaseTask, PipelineData } from './base';

export interface OutputTask extends BaseTask {
    type: 'output';
    outputFunction: (pipelineData: PipelineData) => string | JSX.Element;
}

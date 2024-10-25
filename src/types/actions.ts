import { BaseTask, TaskKey, TaskStream } from './base';
import { HistoryEntry } from './terminal';

export type ActionFunction = (
    taskKey: TaskKey,
    taskStream: TaskStream,
    print: (entry: HistoryEntry) => void,
    display: (message: string | JSX.Element) => void,
    clearDisplay: () => void
) => Promise<any> | any;

export interface ActionTask extends BaseTask {
    type: 'action';
    actionFunction: ActionFunction;
}

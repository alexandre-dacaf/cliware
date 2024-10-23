import { BaseTask, TaskKey, TaskStream } from './base';
import { HistoryEntry } from './terminal';

export type ActionFunction = (
    taskKey: TaskKey,
    taskStream: TaskStream,
    printOnTerminalHistory: (entry: HistoryEntry) => void,
    printTransientOutput: (message: string | JSX.Element) => void,
    clearTransientOutput: () => void
) => Promise<any> | any;

export interface ActionTask extends BaseTask {
    type: 'action';
    actionFunction: ActionFunction;
}

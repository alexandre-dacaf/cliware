import { ActionFunction } from 'types';

export const createTodo: ActionFunction = async (taskKey, taskStream, printOnTerminalHistory, printTransientOutput, clearTransientOutput): Promise<any> => {
    if (taskStream && printOnTerminalHistory && printTransientOutput && clearTransientOutput) {
        printTransientOutput('Executing...');

        // Simulate 2s wait
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        clearTransientOutput();

        printOnTerminalHistory({ type: 'output', content: `Tarefa ${JSON.stringify(taskStream)} criada com sucesso!` });
    }
};

import { ActionFunction } from 'types';

export const createTodo: ActionFunction = async (
    taskKey,
    taskStream,
    print,
    display,
    clearDisplay
): Promise<any> => {
    if (taskStream && print && display && clearDisplay) {
        display('Executing...');

        // Simulate 2s wait
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        clearDisplay();

        print({
            type: 'output',
            content: `Tarefa ${JSON.stringify(taskStream)} criada com sucesso!`,
        });
    }
};

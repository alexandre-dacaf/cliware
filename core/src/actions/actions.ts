import { TaskKey, PipelineData } from "../types";

export const createTodo = async (taskKey: TaskKey, pipelineData: PipelineData): Promise<PipelineData> => {
    // Simulate 2s wait
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    // Simulate success response
    const simulatedResponse = { success: true };

    if (simulatedResponse.success) {
        return { ...pipelineData, [taskKey]: { success: true } };
    } else {
        return { ...pipelineData, [taskKey]: { error: "Simulated error" } };
    }
};

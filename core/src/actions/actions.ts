import { TaskKey, PipelineData } from "../types";

export const createTodo = async (pipelineData: PipelineData): Promise<any> => {
    // Simulate 2s wait
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    // Simulate success response
    const simulatedResponse = { success: true };

    if (simulatedResponse.success) {
        return { success: true };
    } else {
        return { error: "Simulated error" };
    }
};

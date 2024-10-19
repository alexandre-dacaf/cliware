import { CommandConfig, TaskKey, PipelineData } from "../types";
import { changeTerminalColumns } from "../actions";

export const coreCommands: CommandConfig = {
    columns: {
        entrypoint: "howMany",
        pipeline: {
            howMany: {
                type: "prompt",
                promptType: "text",
                message: "How many terminal columns?",
                next: "change",
            },
            change: {
                type: "action",
                actionFunction: async (
                    taskKey: TaskKey,
                    pipelineData: PipelineData
                ) => {
                    const colums: number = +pipelineData.howMany;
                    return await changeTerminalColumns(colums);
                },
                next: "result",
            },
            result: {
                type: "output",
                outputFunction: () => {
                    return "Emitted event 'changeTerminalColumns'.";
                },
            },
        },
    },
};

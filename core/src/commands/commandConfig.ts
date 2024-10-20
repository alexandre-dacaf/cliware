import { CommandConfig, TaskKey, PipelineData } from "../types";
import { createTodo } from "./actions";
import { coreCommands } from "./coreCommands";

export const commandConfig: CommandConfig = {
    ...coreCommands,
    createTodo: {
        entrypoint: "name",
        pipeline: {
            name: {
                type: "prompt",
                promptType: "text",
                message: "Qual é o nome da tarefa?",
                next: "date",
            },
            date: {
                type: "prompt",
                promptType: "text",
                message: "Qual é a data de finalização?",
                next: "completed",
            },
            completed: {
                type: "prompt",
                promptType: "confirm",
                message: "A tarefa está concluída?",
                falseLabel: "No",
                trueLabel: "Yes",
                next: "tag",
            },
            tag: {
                type: "prompt",
                promptType: "select",
                message: "Selecione uma tag",
                choices: [
                    { value: 1, label: "Tarefa" },
                    { value: 2, label: "Projeto" },
                    { value: 3, label: "Diversão" },
                ],
                next: "save",
            },
            save: {
                type: "action",
                actionFunction: async (
                    taskKey: TaskKey,
                    pipelineData: PipelineData
                ) => {
                    return await createTodo(pipelineData);
                },
                next: "result",
            },
            result: {
                type: "output",
                outputFunction: (pipelineData: PipelineData) => {
                    if (pipelineData.$pipeline.save.success) {
                        return `Tarefa '${JSON.stringify(
                            pipelineData
                        )}' criada com sucesso!`;
                    } else {
                        throw new Error(
                            `Erro ao criar a tarefa: ${pipelineData.$pipeline.save.error}`
                        );
                    }
                },
            },
        },
    },
};
import { TaskKey, PipelineData } from "../../types";

export const changeTerminalColumns = (
    taskKey: TaskKey,
    pipelineData: PipelineData
) => {
    const columns: number = +pipelineData.$cmd.args[0];

    if (!columns) {
        throw new Error("Insira um número de colunas. Ex.: 'columns 3'.");
    }

    const event = new CustomEvent("changeTerminalColumns", {
        detail: { columns },
    });
    window.dispatchEvent(event);
};

export const createTerminal = (
    taskKey: TaskKey,
    pipelineData: PipelineData
) => {
    const event = new CustomEvent("createTerminal");
    window.dispatchEvent(event);
};

export const deleteTerminal = (
    taskKey: TaskKey,
    pipelineData: PipelineData
) => {
    // const terminalId = pipelineData.$terminal.terminalId;
    const event = new CustomEvent("deleteTerminal");
    window.dispatchEvent(event);
};

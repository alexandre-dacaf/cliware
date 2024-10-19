import { CommandConfig } from "../types";
import { changeTerminalColumns, createTerminal } from "../actions";

export const coreCommands: CommandConfig = {
    cols: {
        entrypoint: "action",
        pipeline: {
            action: {
                type: "action",
                actionFunction: changeTerminalColumns,
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
    nt: {
        entrypoint: "action",
        pipeline: {
            action: {
                type: "action",
                actionFunction: createTerminal,
                next: "result",
            },
            result: {
                type: "output",
                outputFunction: () => {
                    return "Emitted event 'createTerminal'.";
                },
            },
        },
    },
};

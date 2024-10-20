import { PipelineCmdData } from "../../types";

export const parseCommandArguments = (args: string[]) => {
    const data: PipelineCmdData = {
        args: [],
        options: {},
        flags: [],
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith("--")) {
            const [option, value] = arg.split("=");
            data.options[option.slice(2)] = value ?? "true";
        } else if (arg.startsWith("-")) {
            data.flags.push(arg.slice(1));
        } else {
            data.args.push(arg);
        }
    }

    return data;
};

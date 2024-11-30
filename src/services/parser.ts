import { Command } from 'types';

export const parseCommandArguments = (command: string) => {
    const [baseCommand, ...commandArgs] = command.split(' ');

    const data: Command.Args = {
        baseCommand,
        args: [],
        options: {},
        flags: [],
    };

    for (let i = 0; i < commandArgs.length; i++) {
        const arg = commandArgs[i];

        if (arg.startsWith('--')) {
            const [option, value] = arg.split('=');
            data.options[option.slice(2)] = value ?? 'true';
        } else if (arg.startsWith('-')) {
            data.flags.push(arg.slice(1));
        } else {
            data.args.push(arg);
        }
    }

    return data;
};

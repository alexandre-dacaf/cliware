import usePrinter from 'hooks/printer/usePrinter';
import { Choice } from 'types';

interface PromptSubmitArgs {
    data: any;
    checkRequired?: (data: any, isRequired?: boolean) => boolean | string;
    validate?: (data: any) => boolean | string;
    print?: (data: any) => void;
    clear?: () => void;
}

type PromptSubmitFunction = (args: PromptSubmitArgs) => void | boolean;

const usePromptSubmitter = (message: string, onPromptSubmit: (data: any) => void) => {
    const { printInputOnHistory, printTransientOutput, clearTransientOutput } = usePrinter();

    const returnTrue = () => {
        return true;
    };

    const isChoice = (obj: any): obj is Choice => {
        return obj && typeof obj === 'object' && 'label' in obj && typeof obj.label === 'string';
    };

    const defaultPrint = (data: any): void => {
        let output: string;

        if (typeof data === 'string') {
            output = data;
        } else if (typeof data === 'number') {
            output = data.toString();
        } else if (data instanceof Date) {
            output = data.toISOString().split('T')[0];
        } else if (Array.isArray(data)) {
            if (data.length === 0) {
                output = '';
            } else if (data.every((item) => typeof item === 'string' || typeof item === 'number')) {
                output = data.join(', ');
            } else if (data.every((item) => isChoice(item))) {
                output = data.map((item) => item.label).join(', ');
            } else {
                output = JSON.stringify(data);
            }
        } else if (isChoice(data)) {
            output = data.label;
        } else {
            output = JSON.stringify(data);
        }

        output = `${message} ${output}`;
        printInputOnHistory(output);
    };

    const pass = () => {};

    const submit: PromptSubmitFunction = ({ data, checkRequired = returnTrue, validate = returnTrue, print = defaultPrint, clear = pass }) => {
        const checkResult = checkRequired(data);
        if (checkResult !== true) {
            setTimeout(() => {
                clearTransientOutput();
            }, 2000);
            printTransientOutput(checkResult === false ? 'Input required.' : checkResult);
            return;
        }

        const validateResult = validate(data);
        if (validateResult !== true) {
            setTimeout(() => {
                clearTransientOutput();
            }, 2000);
            printTransientOutput(validateResult === false ? 'Input validation failed.' : validateResult);
            return;
        }

        print(data);
        onPromptSubmit(data);
        clear();
    };

    return { submit };
};

export default usePromptSubmitter;

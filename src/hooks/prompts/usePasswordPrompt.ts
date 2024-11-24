import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { ValidateFunction } from 'types';

type UsePasswordPromptProps = {
    message: string;
    required: boolean;
    validate: ValidateFunction;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const usePasswordPrompt = ({
    message,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
}: UsePasswordPromptProps) => {
    const [value, setValue] = useState<string>('');
    const { printInput, display, clearDisplay } = usePrinter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();
        const currentContent: string = event.target.value;
        setValue(currentContent);
    };

    const submit = () => {
        if (required && !value) {
            display('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(value);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            display(validationMessage);
            return;
        }

        printInput(`${message} ${'•'.repeat(8)}`);
        onSubmit(value);
        setValue('');
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        preventDefaultEvents(event);
        const isCtrlPressed = event.ctrlKey;

        if (event.key === 'Enter') {
            submit();
        } else if (event.key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (event.key === 'Escape' && isCtrlPressed) {
            onAbort();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default usePasswordPrompt;

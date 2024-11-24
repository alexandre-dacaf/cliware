import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ValidateFunction } from 'types';

type UseTextPromptProps = {
    message: string;
    defaultValue: string;
    required: boolean;
    trim: boolean;
    validate: ValidateFunction;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useTextPrompt = ({
    message,
    defaultValue,
    required,
    trim,
    validate,
    onSubmit,
    onEscape,
    onAbort,
}: UseTextPromptProps) => {
    const [value, setValue] = useState<string>('');
    const { printInput, display, clearDisplay } = usePrinter();

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();
        setValue(event.target.value);
    };

    const submit = () => {
        let formattedValue = value;

        if (trim) {
            formattedValue = formattedValue.trim();
        }

        if (required && !formattedValue) {
            display('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(formattedValue);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            display(validationMessage);
            return;
        }

        printInput(`${message} ${formattedValue}`);
        onSubmit(formattedValue);
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

export default useTextPrompt;

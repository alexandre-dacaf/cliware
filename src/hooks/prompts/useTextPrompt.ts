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
    onGoBack: () => void;
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
    onGoBack,
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
        const key = event.key;
        const isCtrlPressed = event.ctrlKey;
        preventDefaultEvents(event);

        if (key === 'Enter') {
            submit();
        } else if (key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (key === 'Escape' && isCtrlPressed) {
            onAbort();
        } else if (key === 'ArrowUp' && isCtrlPressed) {
            onGoBack();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default useTextPrompt;

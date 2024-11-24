import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { ValidateFunction } from 'types';

type UseListPromptProps = {
    message: string;
    separator: string;
    trim: boolean;
    required: boolean;
    validate: ValidateFunction;
    onSubmit: (data: string[]) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useListPrompt = ({
    message,
    separator,
    trim,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
}: UseListPromptProps) => {
    const [value, setValue] = useState<string>('');
    const [list, setList] = useState<string[]>([]);
    const { printInput, display, clearDisplay } = usePrinter();

    useEffect(() => {
        let splitContent = value.split(separator);

        if (trim) {
            splitContent = splitContent.map((item) => item.trim());
            splitContent = splitContent.filter((i) => i.length > 0);
        }

        setList(splitContent);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();
        setValue(event.target.value);
    };

    const submit = () => {
        if (required && list.length === 0) {
            display('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(list);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            display(validationMessage);
            return;
        }

        const formattedList = JSON.stringify(list);
        printInput(`${message} ${formattedList}`);
        setValue('');
        onSubmit(list);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
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

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default useListPrompt;

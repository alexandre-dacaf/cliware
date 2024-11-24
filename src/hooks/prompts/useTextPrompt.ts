import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';

type UseTextPromptProps = {
    message: string;
    defaultValue: string;
    required: boolean;
    trim: boolean;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useTextPrompt = ({
    message,
    defaultValue,
    required,
    trim,
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

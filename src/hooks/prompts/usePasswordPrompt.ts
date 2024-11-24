import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';

type UsePasswordPromptProps = {
    message: string;
    required: boolean;
    onSubmit: (data: string) => void;
    onEscape: () => void;
};

const usePasswordPrompt = ({ message, required, onSubmit, onEscape }: UsePasswordPromptProps) => {
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

        printInput(`${message} ${'•'.repeat(8)}`);
        onSubmit(value);
        setValue('');
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        preventDefaultEvents(event);

        if (event.key === 'Enter') {
            submit();
        }
        if (event.key === 'Escape') {
            onEscape();
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

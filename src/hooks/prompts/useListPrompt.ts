import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';

type UseListPromptProps = {
    message: string;
    separator: string;
    trim: boolean;
    required: boolean;
    onSubmit: (data: string[]) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useListPrompt = ({
    message,
    separator,
    trim,
    required,
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

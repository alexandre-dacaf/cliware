import usePrinter from 'hooks/printer/usePrinter';
import { useEffect, useState, KeyboardEvent as ReactKeyboardEvent } from 'react';

type UseDatePromptProps = {
    message: string;
    defaultValue: string;
    required: boolean;
    onSubmit: (data: Date | null) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useDatePrompt = ({
    message,
    defaultValue,
    required,
    onSubmit,
    onEscape,
    onAbort,
}: UseDatePromptProps) => {
    const [stringValue, setStringValue] = useState<string>(defaultValue);
    const [dateValue, setDateValue] = useState<Date | null>(parseDate(defaultValue));
    const { printInput, display, clearDisplay } = usePrinter();

    useEffect(() => {
        setStringValue(defaultValue);
        setDateValue(parseDate(defaultValue));
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();

        let inputValue = event.target.value;

        // Remove non-digit characters
        inputValue = inputValue.replace(/\D/g, '');

        // Limit to 8 characters (ddmmyyyy)
        if (inputValue.length > 8) {
            inputValue = inputValue.slice(0, 8);
        }

        // Add slashes
        if (inputValue.length > 4) {
            inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}/${inputValue.slice(
                4
            )}`;
        } else if (inputValue.length > 2) {
            inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2)}`;
        }

        setStringValue(inputValue);
        setDateValue(parseDate(inputValue));
    };

    const submit = () => {
        if (required && !dateValue) {
            display('Invalid date.');
            return;
        }

        printInput(`${message} ${stringValue}`);
        onSubmit(dateValue);
        clear();
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
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const clear = () => {
        const currentTime = new Date();
        setDateValue(currentTime);
        setStringValue(formatDate(currentTime));
    };

    return { stringValue, handleChange, handleKeyDown };
};

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // `Date` months start at 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const parseDate = (value: string): Date | null => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // `Date` months start at 0
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
    }
    return null;
};

export default useDatePrompt;

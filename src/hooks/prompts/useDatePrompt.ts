import usePrinter from 'hooks/printer/usePrinter';
import { useEffect, useState, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { getMaskFunction } from 'services';
import { ValidateFunction } from 'types';

type UseDatePromptProps = {
    message: string;
    defaultValue: string;
    required: boolean;
    validate: ValidateFunction;
    onSubmit: (data: Date | null) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useDatePrompt = ({
    message,
    defaultValue,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseDatePromptProps) => {
    const [stringValue, setStringValue] = useState<string>(defaultValue);
    const [dateValue, setDateValue] = useState<Date | null>(parseDate(defaultValue));
    const { printPromptResponse, display, clearDisplay } = usePrinter();

    useEffect(() => {
        setStringValue(defaultValue);
        setDateValue(parseDate(defaultValue));
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();

        let inputValue = event.target.value;

        inputValue = getMaskFunction('date')(inputValue);

        setStringValue(inputValue);
        setDateValue(parseDate(inputValue));
    };

    const submit = () => {
        if (required && !dateValue) {
            display({ output: 'Invalid date.' });
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(dateValue);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            display({ output: validationMessage });
            return;
        }

        printPromptResponse(`${message} ${stringValue}`);
        onSubmit(dateValue);
        clear();
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
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

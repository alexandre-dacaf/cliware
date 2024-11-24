import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, useMemo, KeyboardEvent as ReactKeyboardEvent } from 'react';

type UseNumberPromptProps = {
    message: string;
    max: number;
    min: number;
    step: number;
    float: boolean;
    decimals: number;
    defaultValue: number;
    required: boolean;
    onSubmit: (data: number) => void;
    onEscape: () => void;
    onAbort: () => void;
};

const useNumberPrompt = ({
    message,
    max,
    min,
    step,
    float,
    decimals,
    defaultValue,
    required,
    onSubmit,
    onEscape,
    onAbort,
}: UseNumberPromptProps) => {
    const [value, setValue] = useState<string>('0');
    const { printInput, display, clearDisplay } = usePrinter();

    const initValue = useMemo(() => {
        return Math.max(defaultValue, min);
    }, [defaultValue, min]);

    useEffect(() => {
        setValue(formatFloatDecimals(initValue));
    }, [initValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();

        const inputValue = event.target.value;

        if (!isValidInput(inputValue)) {
            return;
        }

        setValue(inputValue);
    };

    const adjustStep = (stepAmount: number) => {
        let numberContent = convertToNumber(value);

        numberContent += stepAmount;

        numberContent = Math.max(min, Math.min(max, numberContent));

        const newStringContent = formatFloatDecimals(numberContent);

        setValue(newStringContent);
    };

    const formatFloatDecimals = (numberContent: number): string => {
        if (float === true) {
            return numberContent.toFixed(decimals);
        } else {
            return Math.floor(numberContent).toString();
        }
    };

    const isValidInput = (inputValue: string): boolean => {
        // Allows empty strings (required validation occurs at submit)
        if (inputValue === '') return true;

        // Checks if string is made of digits, with an optional minus at the start and an optional decimal part
        const regex = /^-?\d*(\.\d*)?$/;
        if (!regex.test(inputValue)) return false;

        // If `float` is false, forbid decimal parts
        if (!float && inputValue.includes('.')) return false;

        // If `float` is true, but decimal places is zero or less, forbid decimal parts
        if (float && decimals <= 0 && inputValue.includes('.')) return false;

        // If `float` is true, allow at most `decimals` decimal places
        if (float && inputValue.includes('.')) {
            const decimalPart = inputValue.split('.')[1];
            if (decimalPart && decimalPart.length > decimals) return false;
        }

        return true;
    };

    const convertToNumber = (value: string): number => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? initValue : parsed;
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        preventDefaultEvents(event);
        const isCtrlPressed = event.ctrlKey;

        if (event.key === 'Enter') {
            submit();
        } else if (event.key === 'ArrowUp') {
            adjustStep(step);
        } else if (event.key === 'ArrowDown') {
            adjustStep(-step);
        } else if (event.key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (event.key === 'Escape' && isCtrlPressed) {
            onAbort();
        }
    };

    const submit = () => {
        if (required && !value) {
            display('Please fill out this field.');
            clear();
            return;
        }

        const numberValue: number = parseFloat(value);

        if (numberValue < min) {
            display(`Minimum value is ${min}.`);
            clear();
            return;
        }

        if (numberValue > max) {
            display(`Maximum value is ${max}.`);
            clear();
            return;
        }

        printInput(`${message} ${numberValue}`);
        onSubmit(numberValue);
        clear();
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const clear = () => {
        setValue(formatFloatDecimals(initValue));
    };

    return { value, handleChange, handleKeyDown };
};

export default useNumberPrompt;

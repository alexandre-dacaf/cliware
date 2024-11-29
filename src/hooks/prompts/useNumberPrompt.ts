import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useState, useEffect, useMemo, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Prompt } from 'types';

type UseNumberPromptProps = {
    message: string;
    max: number;
    min: number;
    step: number;
    float: boolean;
    decimals: number;
    defaultValue: number;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: number) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
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
    validate,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseNumberPromptProps) => {
    const [value, setValue] = useState<string>('0');
    const { printPromptResponse } = useHistoryLogger();
    const { setMessageText, clearDisplay } = useMessagePanel();

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
        const key = event.key;
        const isCtrlPressed = event.ctrlKey;
        preventDefaultEvents(event);

        if (key === 'Enter') {
            submit();
        } else if (key === 'ArrowUp' && !isCtrlPressed) {
            adjustStep(step);
        } else if (key === 'ArrowDown' && !isCtrlPressed) {
            adjustStep(-step);
        } else if (key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (key === 'Escape' && isCtrlPressed) {
            onAbort();
        } else if (key === 'ArrowUp' && isCtrlPressed) {
            onGoBack();
        }
    };

    const submit = () => {
        if (required && !value) {
            setMessageText('Please fill out this field.');
            clear();
            return;
        }

        const numberValue: number = parseFloat(value);

        if (numberValue < min) {
            setMessageText(`Minimum value is ${min}.`);
            clear();
            return;
        }

        if (numberValue > max) {
            setMessageText(`Maximum value is ${max}.`);
            clear();
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(numberValue);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageText(validationMessage);
            return;
        }

        printPromptResponse(`${message} ${numberValue}`);
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

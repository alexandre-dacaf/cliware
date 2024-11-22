import { useState, useEffect, useMemo } from 'react';

const useNumberPrompt = (min: number, float: boolean, decimals: number) => {
    const [value, setValue] = useState<string>('0');

    const minOrZero = useMemo(() => Math.max(0, min), [min]);

    useEffect(() => {
        const initValue = minOrZero;
        setValue(formatFloatDecimals(initValue));
    }, [min]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        if (!isValidInput(inputValue)) {
            return;
        }

        setValue(inputValue);
    };

    const adjustStep = (stepAmount: number) => {
        let numberContent = convertToNumber(value);

        numberContent += stepAmount;

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
        return isNaN(parsed) ? minOrZero : parsed;
    };

    const clear = () => {
        setValue(formatFloatDecimals(minOrZero));
    };

    return { value, handleChange, adjustStep, clear };
};

export default useNumberPrompt;

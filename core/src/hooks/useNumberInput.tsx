import { useState, useRef } from 'react';
import { getDigitsBeforeCaret, setCaretPosition } from '../services/utils';

const useNumberInput = (min: number, max: number, float: boolean, decimals: number) => {
    const [content, setContent] = useState<string>('');
    const inputRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (inputRef.current) {
            const digitsBeforeCaret = getDigitsBeforeCaret(inputRef.current);
            const currentContent = inputRef.current.innerText ?? '';
            const formattedContent = processInput(currentContent);

            setContent(formattedContent);
            if (inputRef.current) {
                inputRef.current.innerText = formattedContent;
                setCaretPosition(inputRef.current, digitsBeforeCaret);
            }
        }
    };

    const processInput = (rawContent: string): string => {
        let formattedContent = rawContent;

        // Step 1: Remove all characters that are not digits, hyphen or decimal point (if float)
        if (float) {
            formattedContent = rawContent.replace(/[^0-9\-.]/g, '');
        } else {
            formattedContent = rawContent.replace(/[^0-9-]/g, '');
        }

        // Step 2: Ensure that the hyphen, if present, is only at the beginning
        const hasLeadingHyphen = formattedContent.startsWith('-');
        formattedContent = formattedContent.replace(/-/g, '');

        if (hasLeadingHyphen) {
            formattedContent = '-' + formattedContent;
        }

        if (float) {
            // Passo 3a: Garantir que apenas um ponto decimal esteja presente
            const firstDotIndex = formattedContent.indexOf('.');
            if (firstDotIndex !== -1) {
                // Manter apenas o primeiro ponto e remover os demais
                formattedContent =
                    formattedContent.slice(0, firstDotIndex + 1) +
                    formattedContent.slice(firstDotIndex + 1).replace(/\./g, '');
            }

            // Passo 3b: Limitar o número de casas decimais
            const [integerPart, decimalPart] = formattedContent.split('.');
            if (decimalPart) {
                formattedContent = integerPart + '.' + decimalPart.slice(0, decimals);
            }
        }

        // Step 3: Convert to number and apply limits
        let numberContent: number = parseFloat(formattedContent) ?? 0;
        if (isNaN(numberContent)) {
            numberContent = Math.max(0, min);
        }
        numberContent = applyLimits(numberContent);

        // Step 4: Format according to `float` and `decimals`
        // formattedContent = formatFloatDecimals(numberContent);

        return formattedContent;
    };

    const adjustStep = (stepAmount: number) => {
        let numberContent: number = parseFloat(content) ?? 0;
        numberContent += stepAmount;

        numberContent = applyLimits(numberContent);

        const newStringContent = formatFloatDecimals(numberContent);

        setContent(newStringContent);
        if (inputRef.current) {
            inputRef.current.innerText = newStringContent;
            setCaretPosition(inputRef.current, newStringContent.length);
        }
    };

    const clearContent = () => {
        setContent('');
        if (inputRef.current) {
            inputRef.current.innerText = '';
        }
    };

    const applyLimits = (numberContent: number): number => {
        if (numberContent > max) {
            return max;
        }

        if (numberContent < min) {
            return min;
        }

        return numberContent;
    };

    const formatFloatDecimals = (numberContent: number): string => {
        if (float === true) {
            return numberContent.toFixed(decimals);
        } else {
            return Math.round(numberContent).toString();
        }
    };

    return { content, inputRef, handleInput, adjustStep, clearContent };
};

export default useNumberInput;

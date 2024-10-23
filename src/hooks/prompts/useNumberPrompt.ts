import { useState, useRef, useEffect } from 'react';
import { getDigitsBeforeCaret, setCaretPosition } from 'services/utils';

const useNumberPrompt = (min: number, max: number, float: boolean, decimals: number) => {
    const [value, setValue] = useState<string>('0');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initValue = Math.max(0, min);
        setValue(formatFloatDecimals(initValue));
    }, [min]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;

        // Permitir valor vazio
        if (inputValue === '') {
            setValue('0');
            return;
        }

        // Verificar se o valor pode ser convertido para número
        const regex = float ? /^-?\d*(\.\d*)?$/ : /^-?\d*$/;
        if (!regex.test(inputValue)) {
            return; // Não permitir valores que não sejam números válidos
        }

        let numericValue = float ? parseFloat(inputValue) : parseInt(inputValue, 10);

        // Se o valor for float, limitar casas decimais
        if (float && inputValue.includes('.')) {
            const decimalPart = inputValue.split('.')[1];
            if (decimalPart && decimalPart.length > decimals) {
                return; // Limitar o número de decimais
            }
        }

        // Aplicar as restrições de min e max
        if (numericValue < min || numericValue > max) {
            return;
        }

        // Atualizar o valor se todas as condições forem satisfeitas
        setValue(inputValue);
    };

    const adjustStep = (stepAmount: number) => {
        let numberContent: number = parseFloat(value) ?? 0;
        numberContent += stepAmount;

        numberContent = applyLimits(numberContent);

        const newStringContent = formatFloatDecimals(numberContent);

        setValue(newStringContent);
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

    const clear = () => {
        setValue('');
        if (inputRef.current) {
            inputRef.current.innerText = '';
        }
    };

    return { value, inputRef, handleChange, adjustStep, clear };
};

export default useNumberPrompt;

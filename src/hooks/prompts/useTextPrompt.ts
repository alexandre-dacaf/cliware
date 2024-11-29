import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { getMaskFunction } from 'services';
import { Prompt } from 'types';

type UseTextPromptProps = {
    message: string;
    defaultValue: string;
    required: boolean;
    trim: boolean;
    validate: Prompt.ValidateFunction;
    mask: Prompt.Mask;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useTextPrompt = ({
    message,
    defaultValue,
    required,
    trim,
    validate,
    mask,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseTextPromptProps) => {
    const [value, setValue] = useState<string>('');
    const { printPromptResponse } = useHistoryLogger();
    const { setMessageText, clearDisplay } = useMessagePanel();

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();

        let inputValue = event.target.value;
        inputValue = getMaskFunction(mask)(inputValue);

        setValue(inputValue);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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

    const submit = () => {
        let formattedValue = value;

        if (trim) {
            formattedValue = formattedValue.trim();
        }

        if (required && !formattedValue) {
            setMessageText('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(formattedValue);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageText(validationMessage);
            return;
        }

        printPromptResponse(`${message} ${formattedValue}`);
        onSubmit(formattedValue);
        setValue('');
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default useTextPrompt;

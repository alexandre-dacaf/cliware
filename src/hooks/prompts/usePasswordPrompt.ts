import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { Prompt } from 'types';

type UsePasswordPromptProps = {
    message: string;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: string) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const usePasswordPrompt = ({
    message,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UsePasswordPromptProps) => {
    const [value, setValue] = useState<string>('');
    const { printPromptResponse } = useHistoryLogger();
    const { setMessageText, clearDisplay } = useMessagePanel();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearDisplay();
        const currentContent: string = event.target.value;
        setValue(currentContent);
    };

    const submit = () => {
        if (required && !value) {
            setMessageText('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(value);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageText(validationMessage);
            return;
        }

        printPromptResponse(`${message} ${'•'.repeat(8)}`);
        onSubmit(value);
        setValue('');
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

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default usePasswordPrompt;

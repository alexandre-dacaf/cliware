import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef } from 'react';
import { Prompt } from 'types';

type UseListPromptProps = {
    message: string;
    separator: string;
    trim: boolean;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: string[]) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useListPrompt = ({
    message,
    separator,
    trim,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseListPromptProps) => {
    const [value, setValue] = useState<string>('');
    const [list, setList] = useState<string[]>([]);
    const { printPromptResponse } = useHistoryLogger();
    const { setDisplayText, clearDisplay } = useMessagePanel();

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
            setDisplayText('Please fill out this field.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(list);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setDisplayText(validationMessage);
            return;
        }

        const formattedList = JSON.stringify(list);
        printPromptResponse(`${message} ${formattedList}`);
        setValue('');
        onSubmit(list);
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
        const preventDefaultKeys = ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { value, handleChange, handleKeyDown };
};

export default useListPrompt;

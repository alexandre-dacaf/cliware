import useHistoryLogger from 'hooks/context/useHistoryLogger';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef, useMemo } from 'react';
import { Prompt } from 'types';

type UseTogglePromptProps = {
    message: string;
    defaultValue: boolean;
    trueLabel: string;
    falseLabel: string;
    onSubmit: (data: boolean) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useTogglePrompt = ({
    message,
    defaultValue,
    trueLabel,
    falseLabel,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseTogglePromptProps) => {
    const [toggle, setToggle] = useState<boolean>(defaultValue);
    const { logPromptResponse } = useHistoryLogger();
    const choices: Prompt.Choice[] = useMemo(
        () => [
            { label: falseLabel, value: false },
            { label: trueLabel, value: true },
        ],
        [falseLabel, trueLabel]
    );

    const submit = () => {
        const selectedChoice = choices.find((choice) => choice.value === toggle);

        if (!selectedChoice) return;

        logPromptResponse(`${message} ${selectedChoice.label}`);
        onSubmit(selectedChoice.value);
        setToggle(defaultValue);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        const isCtrlPressed = event.ctrlKey;
        preventDefaultEvents(event);

        if (
            (key === 'ArrowLeft' ||
                key === 'ArrowUp' ||
                key === 'ArrowRight' ||
                key === 'ArrowDown' ||
                key === 'Tab') &&
            !isCtrlPressed
        ) {
            setToggle((prevToggle) => !prevToggle);
        } else if (key === 'Enter') {
            submit();
        } else if (event.key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (event.key === 'Escape' && isCtrlPressed) {
            onAbort();
        } else if (event.key === 'ArrowUp' && isCtrlPressed) {
            onGoBack();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const preventDefaultKeys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Escape',
        ];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    return { choices, toggle, handleKeyDown };
};

export default useTogglePrompt;

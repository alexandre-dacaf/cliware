import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useRef, useMemo } from 'react';
import { Choice } from 'types';

type UseTogglePromptProps = {
    message: string;
    defaultValue: boolean;
    trueLabel: string;
    falseLabel: string;
    onSubmit: (data: boolean) => void;
    onEscape: () => void;
};

const useTogglePrompt = ({
    message,
    defaultValue,
    trueLabel,
    falseLabel,
    onSubmit,
    onEscape,
}: UseTogglePromptProps) => {
    const [toggle, setToggle] = useState<boolean>(defaultValue);
    const { printInput } = usePrinter();
    const choices: Choice[] = useMemo(
        () => [
            { label: falseLabel, value: false },
            { label: trueLabel, value: true },
        ],
        [falseLabel, trueLabel]
    );

    const submit = () => {
        const selectedChoice = choices.find((choice) => choice.value === toggle);

        if (!selectedChoice) return;

        printInput(`${message} ${selectedChoice.label}`);
        onSubmit(selectedChoice.value);
        setToggle(defaultValue);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
        const key = event.key;
        preventDefaultEvents(event);

        if (
            key === 'ArrowLeft' ||
            key === 'ArrowUp' ||
            key === 'ArrowRight' ||
            key === 'ArrowDown' ||
            key === 'Tab'
        ) {
            setToggle((prevToggle) => !prevToggle);
        } else if (key === 'Enter') {
            submit();
        } else if (key === 'Escape') {
            onEscape();
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

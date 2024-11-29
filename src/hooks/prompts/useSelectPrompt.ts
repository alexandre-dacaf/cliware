import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';
import { Prompt } from 'types';

type UseSelectPromptProps = {
    message: string;
    choices: Prompt.Choice[];
    multiselect: boolean;
    defaultValue: any;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: Prompt.Choice[] | Prompt.Choice) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
};

const useSelectPrompt = ({
    message,
    choices,
    multiselect,
    defaultValue,
    required,
    validate,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}: UseSelectPromptProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
    const [checkedChoices, setCheckedChoices] = useState<Prompt.Choice[]>([]);
    const { printPromptResponse } = useHistoryLogger();
    const { setMessageText, clearDisplay } = useMessagePanel();

    const formattedChoices = useMemo(
        () =>
            choices.map((choice) => ({
                ...choice,
                value: choice.value ?? choice.label,
            })),
        [choices]
    );

    useEffect(() => {
        setSelectedIndex(() => {
            const defaultIndex = formattedChoices.findIndex(
                (choice) => choice.value === defaultValue
            );

            if (!defaultIndex) return 0;

            return defaultIndex;
        });

        setCheckedIndexes([]);
        setCheckedChoices([]);
    }, [formattedChoices, defaultValue]);

    useEffect(() => {
        setCheckedChoices(checkedIndexes.map((index) => formattedChoices[index]));
    }, [checkedIndexes]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        clearDisplay();

        const key = event.key;
        const isShiftPressed = event.shiftKey;
        const isCtrlPressed = event.ctrlKey;
        preventDefaultEvents(event);

        if (
            (key === 'ArrowUp' || key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) &&
            !isCtrlPressed
        ) {
            selectPrevious();
        } else if (
            (key === 'ArrowDown' || key === 'ArrowRight' || (key === 'Tab' && !isShiftPressed)) &&
            !isCtrlPressed
        ) {
            selectNext();
        } else if ((key === ' ' || event.code === 'Space') && multiselect) {
            checkSelected();
        } else if (key === 'Enter' && multiselect) {
            submit();
        } else if (key === 'Enter' && !multiselect) {
            checkAndSubmit();
        } else if (key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (key === 'Escape' && isCtrlPressed) {
            onAbort();
        } else if (key === 'ArrowUp' && isCtrlPressed) {
            onGoBack();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const preventDefaultKeys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Escape',
            'Space',
            ' ',
        ];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const selectPrevious = () => {
        setSelectedIndex(
            (prevIndex) => (prevIndex - 1 + formattedChoices.length) % formattedChoices.length
        );
    };

    const selectNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % formattedChoices.length);
    };

    const checkSelected = () => {
        if (multiselect === true) {
            toggleCheckSelected();
        } else {
            setCheckedIndexes([selectedIndex]);
        }
    };

    const toggleCheckSelected = () => {
        setCheckedIndexes((prev) => {
            if (prev.includes(selectedIndex)) {
                return prev.filter((i) => i !== selectedIndex);
            } else {
                return [...prev, selectedIndex];
            }
        });
    };

    const submit = () => {
        if (required && checkedChoices.length === 0) {
            setMessageText('Choose at least one option.');
            return;
        }

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(checkedChoices);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageText(validationMessage);
            return;
        }

        const formattedCheckedChoices = checkedChoices.map((choice) => choice.label).join(', ');
        printPromptResponse(`${message} ${formattedCheckedChoices}`);
        onSubmit(checkedChoices);
    };

    const checkAndSubmit = () => {
        const selectedChoice = formattedChoices[selectedIndex];

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(selectedChoice);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageText(validationMessage);
            return;
        }

        printPromptResponse(`${message} ${selectedChoice.label}`);
        onSubmit(selectedChoice);
    };

    return {
        selectedIndex,
        checkedIndexes,
        handleKeyDown,
    };
};

export default useSelectPrompt;

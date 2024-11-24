import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';
import { Choice, ValidateFunction } from 'types';

type UseSelectPromptProps = {
    message: string;
    choices: Choice[];
    multiselect: boolean;
    defaultValue: any;
    required: boolean;
    validate: ValidateFunction;
    onSubmit: (data: Choice[] | Choice) => void;
    onEscape: () => void;
    onAbort: () => void;
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
}: UseSelectPromptProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
    const [checkedChoices, setCheckedChoices] = useState<Choice[]>([]);
    const { printInput, display, clearDisplay } = usePrinter();

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
            event.key === 'ArrowUp' ||
            event.key === 'ArrowLeft' ||
            (key === 'Tab' && isShiftPressed)
        ) {
            selectPrevious();
        } else if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowRight' ||
            (key === 'Tab' && !isShiftPressed)
        ) {
            selectNext();
        } else if (event.key === ' ' || event.code === 'Space') {
            checkSelected();
        } else if (event.key === 'Enter' && multiselect) {
            submit();
        } else if (event.key === 'Enter' && !multiselect) {
            checkAndSubmit();
        } else if (event.key === 'Escape' && !isCtrlPressed) {
            onEscape();
        } else if (event.key === 'Escape' && isCtrlPressed) {
            onAbort();
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
            display('Choose at least one option.');
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

            display(validationMessage);
            return;
        }

        const formattedCheckedChoices = checkedChoices.map((choice) => choice.label).join(', ');
        printInput(`${message} ${formattedCheckedChoices}`);
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

            display(validationMessage);
            return;
        }

        onSubmit(selectedChoice);
    };

    return {
        selectedIndex,
        checkedIndexes,
        handleKeyDown,
    };
};

export default useSelectPrompt;

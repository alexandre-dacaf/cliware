import usePrinter from 'hooks/printer/usePrinter';
import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';
import { Choice } from 'types';

type UseSelectPromptProps = {
    message: string;
    choices: Choice[];
    multiselect: boolean;
    defaultValue: any;
    required: boolean;
    onSubmit: (data: Choice[] | Choice) => void;
    onEscape: () => void;
};

const useSelectPrompt = ({
    message,
    choices,
    multiselect,
    defaultValue,
    required,
    onSubmit,
    onEscape,
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
        preventDefaultEvents(event);

        if (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowLeft' ||
            (key === 'Tab' && isShiftPressed)
        ) {
            selectPrevious();
        }
        if (
            event.key === 'ArrowDown' ||
            event.key === 'ArrowRight' ||
            (key === 'Tab' && !isShiftPressed)
        ) {
            selectNext();
        }
        if (event.key === ' ' || event.code === 'Space') {
            checkSelected();
        }
        if (event.key === 'Enter' && multiselect) {
            submit();
        }
        if (event.key === 'Enter' && !multiselect) {
            checkAndSubmit();
        }
        if (event.key === 'Escape') {
            onEscape();
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
        console.log(required, checkedChoices.length);

        if (required && checkedChoices.length === 0) {
            display('Choose at least one option.');
            return;
        }

        const formattedCheckedChoices = checkedChoices.map((choice) => choice.label).join(', ');
        printInput(`${message} ${formattedCheckedChoices}`);
        onSubmit(checkedChoices);
    };

    const checkAndSubmit = () => {
        onSubmit(formattedChoices[selectedIndex]);
    };

    return {
        selectedIndex,
        checkedIndexes,
        handleKeyDown,
    };
};

export default useSelectPrompt;

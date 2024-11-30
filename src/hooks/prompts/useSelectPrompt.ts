import { TerminalContext } from 'context/TerminalContext';
import useHistoryLogger from 'hooks/context/useHistoryLogger';
import useMessagePanel from 'hooks/context/useMessagePanel';
import { KeyboardEvent as ReactKeyboardEvent, useContext, useEffect, useState } from 'react';
import { Pipeline, Prompt } from 'types';

type UseSelectPromptProps = {
    message: string;
    choices: Prompt.Choice[] | Prompt.ChoiceFunction;
    multiselect: boolean;
    defaultValue: any;
    required: boolean;
    validate: Prompt.ValidateFunction;
    onSubmit: (data: Prompt.Choice[] | Prompt.Choice) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
    pipelineContext: Pipeline.Context;
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
    pipelineContext,
}: UseSelectPromptProps) => {
    const [formattedChoices, setFormattedChoices] = useState<Prompt.Choice[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
    const [checkedChoices, setCheckedChoices] = useState<Prompt.Choice[]>([]);
    const { state: terminalState } = useContext(TerminalContext);
    const { logPromptResponse } = useHistoryLogger();
    const { setMessageAlert, clearDisplay } = useMessagePanel();

    useEffect(() => {
        const setChoices = async () => {
            const resolvedChoices: Prompt.Choice[] = await resolveChoices(choices);

            setFormattedChoices(
                resolvedChoices.map((choice) => ({
                    ...choice,
                    value: choice.value ?? choice.label,
                }))
            );
        };

        setChoices();
    }, [choices]);

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

    const resolveChoices = async (
        _choices: Prompt.Choice[] | Prompt.ChoiceFunction
    ): Promise<Prompt.Choice[]> => {
        let resolvedChoices: Prompt.Choice[];

        if (typeof _choices === 'function') {
            if (!pipelineContext) return [];

            return await _choices(pipelineContext);
        }

        return _choices;
    };

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
            setMessageAlert('Choose at least one option.');
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

            setMessageAlert(validationMessage);
            return;
        }

        const formattedCheckedChoices = checkedChoices.map((choice) => choice.label).join(', ');
        logPromptResponse(`${message} ${formattedCheckedChoices}`);
        onSubmit(checkedChoices);
        setFormattedChoices([]);
    };

    const checkAndSubmit = () => {
        const selectedChoice = formattedChoices[selectedIndex];

        if (!selectedChoice) return;

        // `validation` can be a boolean or a string message
        // If it's not true, use it as an alert message or use a default alert message
        const validation = validate(selectedChoice);

        if (validation !== true) {
            const validationMessage =
                validation !== false
                    ? validation
                    : 'Input does not meet the required criteria. Please check and try again.';

            setMessageAlert(validationMessage);
            return;
        }

        logPromptResponse(`${message} ${selectedChoice.label}`);
        onSubmit(selectedChoice);
        setFormattedChoices([]);
    };

    return {
        formattedChoices,
        selectedIndex,
        checkedIndexes,
        handleKeyDown,
    };
};

export default useSelectPrompt;

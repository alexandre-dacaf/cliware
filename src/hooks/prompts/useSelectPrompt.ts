import { useState, useEffect } from 'react';
import { Choice } from 'types';

const useSelectPrompt = (choices: Choice[], multiselect: boolean) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
    const [checkedChoices, setCheckedChoices] = useState<Choice[]>([]);

    useEffect(() => {
        setSelectedIndex(0);
        setCheckedIndexes([]);
        setCheckedChoices([]);
    }, [choices]);

    useEffect(() => {
        setCheckedChoices(checkedIndexes.map((index) => choices[index]));
    }, [checkedIndexes]);

    const selectPrevious = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + choices.length) % choices.length);
    };

    const selectNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % choices.length);
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

    return {
        selectedIndex,
        checkedIndexes,
        checkedChoices,
        selectNext,
        selectPrevious,
        checkSelected,
    };
};

export default useSelectPrompt;

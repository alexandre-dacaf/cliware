import { useState, useEffect } from 'react';
import { Choice } from 'types';

const useSelectPrompt = (choices: Choice[]) => {
    const [value, setValue] = useState<string>('');
    const [filteredChoices, setFilteredChoices] = useState<Choice[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    useEffect(() => {
        setFilteredChoices(choices);
        setSelectedIndex(0);
    }, [choices]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredChoices]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setValue(inputValue);

        if (inputValue.trim() === '') {
            setFilteredChoices(choices);
            return;
        }

        const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const pattern = new RegExp(normalizeText(inputValue), 'i');

        setFilteredChoices(
            choices.filter((choice) => {
                return pattern.test(normalizeText(choice.label));
            })
        );
    };

    const selectPrevious = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredChoices.length) % filteredChoices.length);
    };

    const selectNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredChoices.length);
    };

    return { value, setValue, filteredChoices, selectedIndex, handleChange, selectPrevious, selectNext };
};

export default useSelectPrompt;

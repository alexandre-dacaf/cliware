import { useState, useEffect, useRef } from 'react';
import { Choice } from '../../types';

const useSelectPrompt = (choices: Choice[]) => {
    const [filteredChoices, setFilteredChoices] = useState<Choice[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const inputRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setFilteredChoices(choices);
        setSelectedIndex(0);
    }, [choices]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredChoices]);

    const handleInput = () => {
        if (inputRef.current) {
            const currentContent: string = inputRef.current.textContent ?? '';

            if (currentContent.trim() === '') {
                setFilteredChoices(choices);
                return;
            }

            const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            const pattern = new RegExp(normalizeText(currentContent), 'i');

            setFilteredChoices(
                choices.filter((choice) => {
                    return pattern.test(normalizeText(choice.label));
                })
            );
        }
    };

    const selectPrevious = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + filteredChoices.length) % filteredChoices.length);
    };

    const selectNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredChoices.length);
    };

    return { inputRef, filteredChoices, selectedIndex, handleInput, selectPrevious, selectNext };
};

export default useSelectPrompt;

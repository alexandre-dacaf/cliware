import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Choice } from "../../types";
import "./SelectPrompt.css";

export type SelectPromptProps = {
    message: string;
    choices: Choice[];
    onSubmit: (response: string | number) => void;
    isActive: boolean;
};

const SelectPrompt: React.FC<SelectPromptProps> = ({ message, choices, onSubmit, isActive }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === 0 ? choices.length - 1 : prevIndex - 1));
        } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === choices.length - 1 ? 0 : prevIndex + 1));
        } else if (event.key === "Enter") {
            event.preventDefault();
            const selectedChoice = choices[selectedIndex];
            selectedChoice.value = selectedChoice.value || selectedChoice.label;
            onSubmit(selectedChoice.value);
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    return (
        <div ref={inputRef} className="select-prompt" tabIndex={0} onKeyDown={handleKeyDown}>
            <div className="select-message">{message}</div>
            <div className="select-choices">
                {choices.map((choice, index) => (
                    <span key={index} className={`select-choice ${selectedIndex === index ? "selected" : ""}`}>
                        {choice.label}
                    </span>
                ))}
            </div>
            <span className="select-navigation-hint">
                <em>Use arrow keys to navigate and Enter to confirm.</em>
            </span>
        </div>
    );
};

SelectPrompt.displayName = "SelectPrompt";

export { SelectPrompt };

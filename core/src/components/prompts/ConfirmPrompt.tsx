import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import "./ConfirmPrompt.css";

export type ConfirmPromptProps = {
    message: string;
    onSubmit: (response: boolean) => void;
    choiceTrueLabel?: string;
    choiceFalseLabel?: string;
    isActive: boolean;
};

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({ message, onSubmit, choiceTrueLabel, choiceFalseLabel, isActive }) => {
    const inputRef = useRef<HTMLDivElement>(null);

    const choices = [
        { label: choiceFalseLabel || "No", value: false },
        { label: choiceTrueLabel || "Yes", value: true },
    ];

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === 0 ? choices.length - 1 : prevIndex - 1));
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex === choices.length - 1 ? 0 : prevIndex + 1));
        } else if (event.key === "Enter") {
            event.preventDefault();
            onSubmit(choices[selectedIndex].value);
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    return (
        <div ref={inputRef} className="confirm-prompt" tabIndex={0} onKeyDown={handleKeyDown}>
            <div>
                <span className="confirm-message">{message}</span>
                {choices.map((choice, index) => (
                    <span key={index} className={`confirm-choice ${selectedIndex === index ? "selected" : ""}`}>
                        {choice.label}
                    </span>
                ))}
            </div>
            <span className="confirm-navigation-hint">
                <em>Use arrow keys to navigate and Enter to confirm.</em>
            </span>
        </div>
    );
};

ConfirmPrompt.displayName = "ConfirmPrompt";

export { ConfirmPrompt };

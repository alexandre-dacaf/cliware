import React, { useRef, useState, KeyboardEvent as ReactKeyboardEvent, useEffect } from "react";
import "./TextPrompt.css";

export type TextPromptProps = {
    message: string;
    onSubmit: (response: string) => void;
    isActive: boolean;
};

const TextPrompt: React.FC<TextPromptProps> = ({ message, onSubmit, isActive }) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>("");

    const updateContent = () => {
        if (inputRef.current) {
            const currentContent: string = inputRef.current.textContent || "";
            setContent(currentContent);
            // TODO formatting, validation, etc
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (content.trim() !== "") {
                onSubmit(content.trim());
                setContent("");
                if (inputRef.current) {
                    inputRef.current.textContent = "";
                }
            }
        }
        // TODO: implement esc key handling
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    return (
        <div className="text-prompt">
            <span className="prompt-message">{message}</span>
            <span
                ref={inputRef}
                contentEditable
                className="text-field"
                onInput={updateContent}
                onKeyDown={handleKeyDown}
                data-placeholder="Digite um comando..."
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

TextPrompt.displayName = "TextPrompt";

export { TextPrompt };

import React, {
    useRef,
    useState,
    KeyboardEvent as ReactKeyboardEvent,
    useEffect,
} from "react";
import "./TextPrompt.css";

export type TextPromptProps = {
    message: string;
    onSubmit: (response: string) => void;
    isActive: boolean;
};

const TextPrompt: React.FC<TextPromptProps> = ({
    message,
    onSubmit,
    isActive,
}) => {
    const inputRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>("");

    const updateContent = () => {
        if (inputRef.current) {
            const currentContent: string = inputRef.current.textContent ?? "";

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

        if (event.key === "Tab") {
            if (isActive) {
                event.preventDefault();
                // Opcional: Executar alguma ação específica ao pressionar Tab
            }
        }

        if (event.key === "Escape") {
            // Opcional: Implementar lógica para a tecla Esc, se necessário
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="text-prompt">
            <span className="prompt-message">{message}</span>
            <span
                ref={inputRef}
                contentEditable
                className="text-field"
                onInput={updateContent}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                data-placeholder="Digite um comando..."
                spellCheck="false"
                autoCorrect="off"
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

TextPrompt.displayName = "TextPrompt";

export { TextPrompt };

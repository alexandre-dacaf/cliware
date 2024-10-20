import React, {
    useRef,
    useState,
    useContext,
    useEffect,
    KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { TerminalContext } from "../../context/TerminalContext";
import "./CommandInput.css";

interface CommandInputProps {
    onCommand: (command: string) => void;
    isActive: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onCommand, isActive }) => {
    const { state, dispatch } = useContext(TerminalContext);
    const inputRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>("");

    const handleInput = () => {
        if (inputRef.current) {
            setContent(inputRef.current.textContent ?? "");
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const trimmedContent = content.trim();
            if (trimmedContent !== "") {
                onCommand(trimmedContent);
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
            if (isActive) {
                event.preventDefault();
                dispatch({ type: "DEACTIVATE_TERMINAL" });
            }
        }
    };

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="command-input-container">
            <span className="command-prompt">$</span>
            <div
                ref={inputRef}
                contentEditable
                className="command-input"
                onInput={handleInput}
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

export default CommandInput;

import React, {
    useRef,
    useState,
    KeyboardEvent as ReactKeyboardEvent,
} from "react";
import "./TextField.css";

interface TextFieldProps {
    onContentChanged: (content: string) => void;
    onEnterPressed: (content: string) => void;
}

const TextField = ({ onContentChanged, onEnterPressed }: TextFieldProps) => {
    const selfRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>("");

    const updateContent = () => {
        if (selfRef.current) {
            const content: string = selfRef.current.textContent || "";
            setContent(content);
            onContentChanged(content);
        }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onEnterPressed(content);
        }
        // TODO handle esc key
    };

    return (
        <div
            ref={selfRef}
            contentEditable
            className="text-field"
            onInput={updateContent}
            onKeyDown={handleKeyDown}
            data-placeholder="Digite um comando..."
            suppressContentEditableWarning={true}
        />
    );
};

export default TextField;

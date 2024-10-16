import React, { useRef } from "react";
import Input, { InputHandle } from "../inputs/Input";
import TextOutput from "../outputs/TextOutput";
import "./TextPrompt.css";

interface TextPromptProps {
    onPrint: (
        component: React.ComponentType<any>,
        props: Record<string, any>
    ) => void;
}

const TextPrompt = ({ onPrint }: TextPromptProps) => {
    const inputRef = useRef<InputHandle>(null);

    const handleEnterPressed = (content: string) => {
        onPrint(TextOutput, { content });
        inputRef.current?.clear();
    };

    return (
        <div className="terminal__prompt">
            <Input ref={inputRef} onEnterPressed={handleEnterPressed} />
        </div>
    );
};

TextPrompt.displayName = "TextPrompt";

export default TextPrompt;

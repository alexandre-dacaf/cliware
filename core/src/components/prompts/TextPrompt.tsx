import React from "react";
import TextField from "../input-fields/TextField";
import TextOutput from "../printables/TextOutput";
import { IPrintable } from "../../types/printables";
import "./TextPrompt.css";

interface TextPromptProps {
    onPrint: (printable: IPrintable) => void;
}

const TextPrompt = ({ onPrint }: TextPromptProps) => {
    const handleContentChanged = (content: string) => {
        // Not implemented yet
    };

    const handleEnterPressed = (content: string) => {
        onPrint({ component: TextOutput, props: { content } });
        // Clear TextField content
    };

    return (
        <div className="terminal__prompt">
            <TextField
                onContentChanged={handleContentChanged}
                onEnterPressed={handleEnterPressed}
            />
        </div>
    );
};

TextPrompt.displayName = "TextPrompt";

export default TextPrompt;

import React from "react";
import TextField from "../fields/TextField";
import "./TextVariant.css";

interface TextVariantProps {
    message: string;
    onSubmit: (response: string) => void;
}

const TextVariant = ({ message, onSubmit }: TextVariantProps) => {
    const handleContentChanged = (content: string) => {
        // TODO implement validation, masking, etc
    };

    const handleEnterPressed = (content: string) => {
        onSubmit(content);
        // TODO clear textField content via forwardRef and useImperativeHandle
    };

    return (
        <div className="text-variant">
            {message}
            <TextField
                onContentChanged={handleContentChanged}
                onEnterPressed={handleEnterPressed}
            />
        </div>
    );
};

TextVariant.displayName = "TextVariant";

export default TextVariant;

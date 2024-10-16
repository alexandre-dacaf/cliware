import React, { useState, useEffect } from "react";
import TextVariant from "./variants/TextVariant";

import { promptChainConfig } from "../config/promptChainConfig";

import "./Terminal.css";

const Terminal: React.FC = () => {
    const [currentPromptKey, setCurrentPromptKey] = useState<string | null>(
        null
    );
    const [answers, setAnswers] = useState<string[]>([]);

    const initialPromptKey = "name";

    useEffect(() => {
        setCurrentPromptKey(initialPromptKey);
    }, []);

    const promptVariantMap = {
        text: TextVariant,
    };

    const handleSubmit = (response: string) => {
        if (currentPromptKey) {
            const currentPromptConfig = promptChainConfig[currentPromptKey];
            setAnswers([...answers, response]);

            console.log("Answers so far: ", answers);

            const nextPromptKey = currentPromptConfig.next();
            setCurrentPromptKey(nextPromptKey);
        }
    };

    const renderCurrentPrompt = () => {
        if (currentPromptKey) {
            const currentPromptConfig = promptChainConfig[currentPromptKey];
            const PromptVariant =
                promptVariantMap[currentPromptConfig.variant];

            return (
                <PromptVariant
                    message={currentPromptConfig.message}
                    onSubmit={handleSubmit}
                />
            );
        }
        return null;
    };

    return (
        <div className="terminal active">
            {terminalHistory.map((printable: IPrintable, index: number) => (
                <Printable
                    key={index}
                    component={printable.component}
                    props={printable.props}
                />
            ))}

            {renderCurrentPrompt()}
        </div>
    );
};

Terminal.displayName = "Terminal";

export default Terminal;

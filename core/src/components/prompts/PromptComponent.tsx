import React, { useEffect } from "react";
import { PromptTask, PipelineData } from "../../types";
import { TextPrompt, ConfirmPrompt, SelectPrompt } from "./";
import "./PromptComponent.css";

interface PromptComponentProps {
    task: PromptTask;
    pipelineData: PipelineData;
    onNext: (response: any) => void;
    isActive: boolean;
}

const PromptComponent: React.FC<PromptComponentProps> = ({ task, pipelineData, onNext, isActive }) => {
    useEffect(() => {
        // If the task has logic to pre-populate the response based on pipelineData, implement it here
        // For example, if you are editing and already have a value
    }, [pipelineData]);

    const handleResponse = (resp: any) => {
        onNext(resp);
    };

    const renderPrompt = () => {
        switch (task.promptType) {
            case "text":
                return <TextPrompt message={task.message} onSubmit={handleResponse} isActive={isActive} />;
            case "confirm":
                return (
                    <ConfirmPrompt
                        message={task.message}
                        choiceTrueLabel={task.trueLabel}
                        choiceFalseLabel={task.falseLabel}
                        onSubmit={handleResponse}
                        isActive={isActive}
                    />
                );
            case "select":
                return <SelectPrompt message={task.message} onSubmit={handleResponse} choices={task.choices} isActive={isActive} />;
            default:
                return <p>Prompt type unknown!</p>;
        }
    };

    return <div className="prompt-component">{renderPrompt()}</div>;
};

PromptComponent.displayName = "PromptComponent";

export { PromptComponent };

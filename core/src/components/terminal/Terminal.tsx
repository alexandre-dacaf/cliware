import React, { useState, useEffect, useRef } from "react";

import { commandConfig } from "../../config/commandConfig";
import { CommandConfig, Task, PipelineData } from "../../types";
import { PromptComponent } from "../prompts";
import CommandInput from "../command-input/CommandInput";
import "./Terminal.css";

interface HystoryEntry {
    type: "command" | "input" | "output" | "error";
    content: string | JSX.Element;
}

interface TerminalProps {
    isActive: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ isActive }) => {
    const [currentCommand, setCurrentCommand] = useState<string>("");
    const [currentTaskKey, setCurrentTaskKey] = useState<string | null>(null);
    const [pipelineData, setPipelineData] = useState<PipelineData>({});
    const [history, setHistory] = useState<HystoryEntry[]>([]);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll para o fim do terminal sempre que o histórico mudar
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current?.scrollHeight;
        }
    }, [history]);

    const handleError = (error: any) => {
        setHistory((prev) => [...prev, { type: "error", content: error.message || "ERROR" }]);
        setCurrentTaskKey(null);
        setCurrentCommand("");
        setIsExecuting(false);
    };

    const getCurrentTask = (): Task | null => {
        if (!currentTaskKey || !currentCommand) return null;

        const { pipeline } = commandConfig[currentCommand];
        const currentTask: Task = pipeline[currentTaskKey];

        if (!currentTask) {
            return null;
        }

        return currentTask;
    };

    const goToNextTaskFrom = (currentTask: Task) => {
        let nextTaskKey: string | null = null;

        if (currentTask.next) {
            if (typeof currentTask.next === "function") {
                nextTaskKey = currentTask.next(pipelineData);
            } else {
                nextTaskKey = currentTask.next;
            }
        }

        const commandPipeline = commandConfig[currentCommand].pipeline;
        
        if (nextTaskKey && !(nextTaskKey in commandPipeline)) {
            handleError({ message: `The next task '${nextTaskKey}' does not exist in the pipeline for the command '${currentCommand}'` });
            return;
        }

        setCurrentTaskKey(nextTaskKey);
        if (!nextTaskKey) {
            setCurrentCommand("");
        }
    };

    const handleCommandInput = (command: string) => {
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;

        setHistory((prev) => [...prev, { type: "command", content: `$ ${trimmedCommand}` }]);

        const [cmd, ...args] = trimmedCommand.split(" ");
        const currentCommandConfig = commandConfig[cmd];
        
        const commandEntrypoint = currentCommandConfig?.entrypoint;
        const commandPipeline = currentCommandConfig?.pipeline;

        if (commandPipeline && commandEntrypoint) {
            setPipelineData({});
            const firstTaskKey = commandEntrypoint;
            setCurrentTaskKey(firstTaskKey);
            setCurrentCommand(cmd);
        } else {
            handleError({ message: `'${cmd}' is not a recognized command.` });
        }
    };

    const handlePromptResponse = (response: any) => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== "prompt") return;

        setPipelineData((prev) => ({ ...prev, [currentTaskKey]: response }));
        setHistory((prev) => [...prev, { type: "input", content: `${currentTask.message} ${response}` }]);

        goToNextTaskFrom(currentTask);
    };

    const handleActionTask = async () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== "action") return;

        try {
            setIsExecuting(true);

            const updatedPipelineData = await currentTask.actionFunction(currentTaskKey, pipelineData);
            setPipelineData(updatedPipelineData);
            goToNextTaskFrom(currentTask);
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleOutputTask = () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask || currentTask.type !== "output") return;

        try {
            const outputContent = currentTask.outputFunction(pipelineData);
            setHistory((prev) => [...prev, { type: "output", content: outputContent }]);

            goToNextTaskFrom(currentTask);
        } catch (error: any) {
            handleError(error);
        }
    };

    // useEffect to automatically execute tasks of type 'action' and 'output'
    useEffect(() => {
        if (isExecuting) return; // Avoids multiple executions

        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask) return;

        switch (currentTask.type) {
            case "action":
                handleActionTask();
                break;
            case "output":
                handleOutputTask();
                break;
            default:
                break;
        }
    }, [currentTaskKey, isExecuting]);

    const renderCurrentTask = () => {
        const currentTask = getCurrentTask();
        if (!currentTaskKey || !currentTask) return;

        console.log(currentTask);

        switch (currentTask.type) {
            case "prompt":
                return <PromptComponent task={currentTask} pipelineData={pipelineData} onNext={handlePromptResponse} isActive={isActive} />;
            case "action":
            case "output":
                // 'action' and 'output' are not rendered directly
                return null;
            default:
                return <p>Task type unknown!</p>;
        }
    };

    return (
        <div className={"terminal " + (isActive ? "active" : "")} ref={terminalRef}>
            {history.map((entry, index) => {
                switch (entry.type) {
                    case "command":
                        return (
                            <div key={index} className="terminal-command">
                                {entry.content}
                            </div>
                        );
                    case "input":
                        return (
                            <div key={index} className="terminal-input">
                                {entry.content}
                            </div>
                        );
                    case "output":
                        return (
                            <div key={index} className="terminal-output">
                                {entry.content}
                            </div>
                        );
                    case "error":
                        return (
                            <div key={index} className="terminal-error">
                                {entry.content}
                            </div>
                        );
                    default:
                        return null;
                }
            })}

            {!isExecuting && !currentCommand && <CommandInput onCommand={handleCommandInput} isActive={isActive} />}

            {renderCurrentTask()}

            {isExecuting && <div className="loading">Executando...</div>}
        </div>
    );
};

Terminal.displayName = "Terminal";

export default Terminal;

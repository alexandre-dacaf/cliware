import React, { useState } from "react";
import TextPrompt from "./prompts/TextPrompt";
import Printable from "./outputs/Printable";
import "./Terminal.css";

interface TerminalHistoryItem {
    component: React.ComponentType<any>;
    props: Record<string, any>;
}

const Terminal: React.FC = () => {
    const [terminalHistory, setTerminalHistory] = useState<
        TerminalHistoryItem[]
    >([]);

    const handlePrint = (
        component: React.ComponentType<any>,
        props: Record<string, any>
    ) => {
        setTerminalHistory((previousHistory: TerminalHistoryItem[]) => [
            ...previousHistory,
            { component, props },
        ]);
    };

    return (
        <div className="terminal active">
            {terminalHistory.map((item: TerminalHistoryItem, index: number) => (
                <Printable
                    key={index}
                    component={item.component}
                    props={item.props}
                />
            ))}

            <TextPrompt onPrint={handlePrint} />
        </div>
    );
};

Terminal.displayName = "Terminal";

export default Terminal;

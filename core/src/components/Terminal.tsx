import React, { useState } from "react";
import TextPrompt from "./prompts/TextPrompt";
import Printable from "./printables/Printable";
import { IPrintable } from "../types/printables";
import "./Terminal.css";

const Terminal: React.FC = () => {
    const [terminalHistory, setTerminalHistory] = useState<IPrintable[]>([]);

    const handlePrint = (printable: IPrintable) => {
        setTerminalHistory((previousHistory: IPrintable[]) => [
            ...previousHistory,
            printable,
        ]);
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

            <TextPrompt onPrint={handlePrint} />
        </div>
    );
};

Terminal.displayName = "Terminal";

export default Terminal;

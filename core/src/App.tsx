import React, { useState } from "react";
import Terminal from "./components/terminal/Terminal";
import "./App.css";

const App: React.FC = () => {
    const [activeTerminalId, setActiveTerminalId] = useState<number>(1);

    const terminals = [{ id: 1, name: "Terminal" }];

    return (
        <div className="terminal-container">
            {terminals.map((terminal) => (
                <Terminal key={terminal.id} isActive={terminal.id === activeTerminalId} />
            ))}
        </div>
    );
};

export default App;

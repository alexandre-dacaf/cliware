import React from "react";
import Terminal from "./components/Terminal";
import "./App.css"; // Arquivo CSS para estilos

const App: React.FC = () => {
    return (
        <div className="terminal-container">
            <Terminal />
        </div>
    );
};

export default App;

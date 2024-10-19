import React, { useRef, useEffect, useContext } from "react";
import Terminal from "./components/terminal/Terminal";
import { TerminalProvider, TerminalContext } from "./context/TerminalContext";
import "./App.css";

const App: React.FC = () => {
    return (
        <TerminalProvider>
            <TerminalContainer />
        </TerminalProvider>
    );
};

const TerminalContainer: React.FC = () => {
    const terminalContainerRef = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useContext(TerminalContext);

    const terminals = [
        { id: 1, name: "Terminal 1" },
        { id: 2, name: "Terminal 2" },
    ];

    const columns = 2;

    const handleKeyDown = (event: KeyboardEvent) => {
        if (someTerminalActive()) return;

        event.preventDefault();

        const key = event.key;
        const isShiftPressed = event.shiftKey;

        if (key === "ArrowRight" || key === "Tab") {
            selectNextTerminal();
        } else if (key === "ArrowLeft" || (key === "Tab" && isShiftPressed)) {
            selectPreviousTerminal();
        } else if (key === "Enter") {
            activateTerminal();
        }

        focusSelf();
    };

    const selectNextTerminal = () => {
        const currentTerminalIndex = getCurrentTerminalIndex();
        const nextIndex = (currentTerminalIndex + 1) % terminals.length;

        dispatch({
            type: "SET_SELECTED_TERMINAL",
            payload: terminals[nextIndex].id,
        });

        focusSelf();
    };

    const selectPreviousTerminal = () => {
        const currentTerminalIndex = getCurrentTerminalIndex();
        const prevIndex =
            (currentTerminalIndex - 1 + terminals.length) % terminals.length;

        dispatch({
            type: "SET_SELECTED_TERMINAL",
            payload: terminals[prevIndex].id,
        });

        focusSelf();
    };

    const activateTerminal = () => {
        dispatch({ type: "ACTIVATE_TERMINAL" });
    };

    const getCurrentTerminalIndex = () => {
        return terminals.findIndex(
            (terminal) =>
                terminal.id === state.activeTerminalId ||
                terminal.id === state.selectedTerminalId
        );
    };

    const focusSelf = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            terminalContainerRef.current.focus();
        }
    };

    const someTerminalActive = () => {
        return state.activeTerminalId !== null;
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [state, terminals]);

    const handleBlur = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            setTimeout(() => {
                terminalContainerRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div
            ref={terminalContainerRef}
            tabIndex={0}
            className="terminal-container"
            onBlur={handleBlur}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
            {terminals.map((terminal) => (
                <Terminal
                    key={terminal.id}
                    isActive={terminal.id === state.activeTerminalId}
                    isSelected={terminal.id === state.selectedTerminalId}
                />
            ))}
        </div>
    );
};

export default App;

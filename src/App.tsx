import React, { useState, useRef, useEffect, useContext } from "react";
import Terminal from "./components/terminal/Terminal";
import { TerminalProvider, TerminalContext } from "./context/TerminalContext";
import { TerminalType } from "./types";
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
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const [columns, setColumns] = useState(2);
    const [terminals, setTerminals] = useState<TerminalType[]>([
        { id: 1 },
        { id: 2 },
    ]);

    useEffect(() => {
        window.addEventListener("createTerminal", createTerminal);

        window.addEventListener("deleteTerminal", deleteTerminal);

        const handleChangeColumns = (event: Event) => {
            const customEvent = event as CustomEvent;
            setColumns(customEvent.detail.columns);
        };

        window.addEventListener("changeTerminalColumns", handleChangeColumns);

        return () => {
            window.removeEventListener("createTerminal", createTerminal);
            window.removeEventListener("deleteTerminal", deleteTerminal);
            window.removeEventListener(
                "changeTerminalColumns",
                handleChangeColumns
            );
        };
    }, []);

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
        } else if (key === "Delete") {
            deleteTerminal();
        } else if (key === "n") {
            createTerminal();
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

    const deleteTerminal = () => {
        setTerminals((prevTerminals) => {
            const currentTerminalId =
                stateRef.current.activeTerminalId ??
                stateRef.current.selectedTerminalId;

            if (currentTerminalId == null) {
                return prevTerminals;
            }

            const filteredTerminals = prevTerminals.filter(
                (t) => t.id !== currentTerminalId
            );

            return filteredTerminals;
        });

        dispatch({
            type: "SET_ACTIVE_TERMINAL",
            payload: terminals[0].id,
        });
    };

    const createTerminal = () => {
        setTerminals((prev) => {
            let maxTerminalId = 0;
            if (prev.length !== 0) {
                maxTerminalId = prev.reduce(
                    (max, item) => (item.id > max ? item.id : max),
                    prev[0].id
                );
            }
            const newTerminal = { id: maxTerminalId + 1 };
            console.log(newTerminal);
            return [...prev, newTerminal];
        });
    };

    const getCurrentTerminalIndex = () => {
        return terminals.findIndex(
            (terminal) =>
                terminal.id === stateRef.current.activeTerminalId ||
                terminal.id === stateRef.current.selectedTerminalId
        );
    };

    const focusSelf = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            terminalContainerRef.current.focus();
        }
    };

    const someTerminalActive = () => {
        return stateRef.current.activeTerminalId !== null;
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
                    terminalId={terminal.id}
                    isActive={terminal.id === state.activeTerminalId}
                    isSelected={terminal.id === state.selectedTerminalId}
                />
            ))}
        </div>
    );
};

export default App;

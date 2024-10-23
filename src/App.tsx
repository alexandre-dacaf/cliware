import React, { useEffect } from 'react';
import Terminal from './components/terminal/Terminal';
import { TerminalProvider } from './context/TerminalContext';
import useApp from './hooks/app/useApp';
import './App.css';

const App: React.FC = () => {
    return (
        <TerminalProvider>
            <TerminalContainer />
        </TerminalProvider>
    );
};

const TerminalContainer: React.FC = () => {
    const {
        state,
        terminalContainerRef,
        columns,
        terminals,
        selectNextTerminal,
        selectPreviousTerminal,
        activateTerminal,
        someTerminalActive,
        createTerminal,
        deleteTerminal,
        focusSelf,
    } = useApp();

    const handleKeyDown = (event: KeyboardEvent) => {
        if (someTerminalActive()) return;

        event.preventDefault();

        const key = event.key;
        const isShiftPressed = event.shiftKey;

        if (key === 'ArrowRight' || key === 'Tab') {
            selectNextTerminal();
        } else if (key === 'ArrowLeft' || (key === 'Tab' && isShiftPressed)) {
            selectPreviousTerminal();
        } else if (key === 'Enter') {
            activateTerminal();
        } else if (key === 'Delete') {
            deleteTerminal();
        } else if (key === 'n') {
            createTerminal();
        }

        focusSelf();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [state, terminals]);

    const handleBlur = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            setTimeout(() => {
                focusSelf();
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

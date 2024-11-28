import React, { useEffect } from 'react';
import Terminal from 'components/terminal/Terminal';
import { AppProvider } from 'context/AppContext';
import useApp from 'hooks/app/useApp';
import 'App.scss';
import useAppDispatcher from 'hooks/app/useAppDispatcher';

const App: React.FC = () => {
    return (
        <AppProvider>
            <TerminalContainer />
        </AppProvider>
    );
};

const TerminalContainer: React.FC = () => {
    const { state, terminalContainerRef, someTerminalActive, focusSelf } = useApp();
    const {
        createTerminal,
        deleteCurrentTerminal,
        selectNextTerminal,
        selectPreviousTerminal,
        activateTerminal,
    } = useAppDispatcher();

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
            deleteCurrentTerminal();
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
    }, [state]);

    const handleBlur = () => {
        if (!someTerminalActive() && terminalContainerRef.current) {
            setTimeout(() => {
                focusSelf();
            }, 0);
        }
    };

    const isActive = (terminalId: string) => {
        return terminalId === state.currentTerminalId && state.currentTerminalState === 'active';
    };

    const isFocused = (terminalId: string) => {
        return terminalId === state.currentTerminalId && state.currentTerminalState === 'focused';
    };

    return (
        <div
            ref={terminalContainerRef}
            tabIndex={0}
            className='terminal-container'
            onBlur={handleBlur}
            style={{ gridTemplateColumns: `repeat(${state.terminalColumns}, 1fr)` }}
        >
            {state.terminalList.map((terminal) => (
                <Terminal
                    key={terminal.id}
                    isActive={isActive(terminal.id)}
                    isSelected={isFocused(terminal.id)}
                />
            ))}
        </div>
    );
};

export default App;

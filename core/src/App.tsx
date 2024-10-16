// src/App.tsx

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import Terminal, { TerminalHandle } from './components/Terminal';
import './App.css'; // Arquivo CSS para estilos

type AppState = 'hovering' | 'active';

const App: React.FC = () => {
  const selfRef = useRef<HTMLDivElement>(null);
  const [numColumns] = useState<number>(2);
  const terminalIndexes = [0, 1, 2];
  const terminalsRef = useRef<(TerminalHandle | null)[]>([]);
  const [activeTerminalIndex, setActiveTerminalIndex] = useState<number | null>(null);
  const [hoveredTerminalIndex, setHoveredTerminalIndex] = useState<number>(0);
  const [appState, setAppState] = useState<AppState>('active');

  useEffect(() => {
    selfRef.current?.focus();
    activateTerminal(hoveredTerminalIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = event;

    if (appState !== 'hovering') {
      return;
    }

    if (key === 'ArrowRight' || (key === 'Tab' && !shiftKey)) {
      event.preventDefault();
      hoverNext();
      return;
    }

    if (key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) {
      event.preventDefault();
      hoverPrevious();
      return;
    }

    if (key === 'Enter' || key === ' ') {
      activateTerminal(hoveredTerminalIndex);
    }
  };

  const hoverNext = () => {
    const nextIndex = (hoveredTerminalIndex + 1) % terminalIndexes.length;
    setHoveredTerminalIndex(nextIndex);
    hoverTerminalAt(nextIndex);
  };

  const hoverPrevious = () => {
    const prevIndex =
      (hoveredTerminalIndex - 1 + terminalIndexes.length) % terminalIndexes.length;
    setHoveredTerminalIndex(prevIndex);
    hoverTerminalAt(prevIndex);
  };

  const hoverTerminalAt = (index: number) => {
    const terminal = terminalsRef.current[index];
    if (!terminal) return;

    terminalsRef.current.forEach((term, i) => {
      if (term && i !== index) {
        term.unhover();
      }
    });

    terminal.hover();
  };

  const activateTerminal = (index: number) => {
    const terminal = terminalsRef.current[index];
    if (terminal) {
      terminal.unhover();
      terminal.activate();
      setActiveTerminalIndex(index);
      setAppState('active');
    }
  };

  const handleBlurred = (index: number) => {
    selfRef.current?.focus();

    const terminal = terminalsRef.current[index];
    if (terminal) {
      terminal.deactivate();
      terminal.hover();
      setHoveredTerminalIndex(index);
      setAppState('hovering');
    }
  };

  return (
    <div
      className="terminal-container"
      tabIndex={0}
      ref={selfRef}
      onKeyDown={handleKeyPress}
      style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
    >
      {terminalIndexes.map((terminalIndex) => (
        <Terminal
          key={terminalIndex}
          terminalIndex={terminalIndex}
          ref={(el: TerminalHandle | null) => (terminalsRef.current[terminalIndex] = el)}
          onBlurred={handleBlurred}
        />
      ))}
    </div>
  );
};

export default App;

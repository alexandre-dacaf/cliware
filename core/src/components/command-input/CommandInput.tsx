import React, { useRef, useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from "react";
import "./CommandInput.css";

interface CommandInputProps {
  onCommand: (command: string) => void;
  isActive: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onCommand, isActive }) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");

  const handleInput = () => {
    if (inputRef.current) {
      setContent(inputRef.current.textContent || "");
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedContent = content.trim();
      if (trimmedContent !== "") {
        onCommand(trimmedContent);
        setContent("");
        if (inputRef.current) {
          inputRef.current.textContent = "";
        }
      }
    }
  };

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="command-input-container">
      <span className="command-prompt">$</span>
      <div
        ref={inputRef}
        contentEditable
        className="command-input"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Digite um comando..."
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default CommandInput;

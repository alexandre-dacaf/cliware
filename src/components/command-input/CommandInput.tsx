import React, { useRef, useEffect } from 'react';
import useCommandInput from 'hooks/command-input/useCommandInput';
import { Command } from 'types';
import './CommandInput.scss';

interface CommandInputProps {
    availableCommands: string[];
    itemsPerPage?: number;
    onSubmit: (commandString: string, commandArgs: Command.CommandArgs) => void;
    isActive: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({
    availableCommands,
    itemsPerPage = 10,
    onSubmit,
    isActive,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, pageCommands, pageIndex, handleChange, currentPage, totalPages, handleKeyDown } =
        useCommandInput({
            availableCommands,
            itemsPerPage,
            onSubmit,
            isActive,
        });

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = () => {
        if (isActive && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className='command-input-container'>
            <div>
                <span className='command-prompt'>&gt;</span>
                <input
                    ref={inputRef}
                    className='command-input'
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                />
            </div>

            {isActive ? (
                <div className='div-available-commands'>
                    {pageCommands.map((command, index) => (
                        <span
                            key={index}
                            className={`available-command ${pageIndex === index ? 'selected' : ''}`}
                        >
                            {command}
                        </span>
                    ))}
                    {availableCommands.length > itemsPerPage ? (
                        <em className='command-pages'>
                            Page {currentPage + 1}/{totalPages}
                        </em>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default CommandInput;

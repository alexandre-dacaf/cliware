import React, { useRef, useState, useContext, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AppContext } from 'context/AppContext';
import useCommandInput from 'hooks/command-input/useCommandInput';
import { parseCommandArguments } from 'services/utils/parser';
import { CommandArgs } from 'types';
import './CommandInput.css';

interface CommandInputProps {
    availableCommands: string[];
    itemsPerPage?: number;
    onSubmit: (commandString: string, commandArgs: CommandArgs) => void;
    isActive: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ availableCommands, itemsPerPage = 10, onSubmit, isActive }) => {
    const { dispatch } = useContext(AppContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, setValue, pageCommands, pageIndex, handleChange, autocomplete, selectPrevious, selectNext, nextPage, prevPage, currentPage, totalPages } =
        useCommandInput(availableCommands, itemsPerPage);

    const handleEnter = () => {
        const commandArgs: CommandArgs = parseCommandArguments(value);
        onSubmit(value, commandArgs);
        setValue('');
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        preventDefaultEvents(event);

        if (key === 'ArrowDown') {
            selectNext();
        }
        if (key === 'ArrowUp') {
            selectPrevious();
        }
        if (key === 'Tab') {
            autocomplete();
        }
        if (key === 'Enter') {
            handleEnter();
        }
        if (key === 'Escape') {
            deactivateTerminal();
        }
        if (key === 'PageDown') {
            nextPage();
        }
        if (key === 'PageUp') {
            prevPage();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape', 'PageDown', 'PageUp'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const deactivateTerminal = () => {
        if (isActive) {
            dispatch({ type: 'DEACTIVATE_TERMINAL' });
        }
    };

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
                <span className='command-prompt'>$</span>
                <input ref={inputRef} className='command-input' value={value} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
            </div>

            {isActive ? (
                <div className='div-available-commands'>
                    {pageCommands.map((command, index) => (
                        <span key={index} className={`available-command ${pageIndex === index ? 'selected' : ''}`}>
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

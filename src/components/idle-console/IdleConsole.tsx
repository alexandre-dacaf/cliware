import React, { useRef, useEffect } from 'react';
import useIdleConsole from 'hooks/idle-console/useIdleConsole';
import { Command } from 'types';
import './IdleConsole.scss';

interface IdleConsoleProps {
    itemsPerPage?: number;
    isActive: boolean;
}

const IdleConsole: React.FC<IdleConsoleProps> = ({ itemsPerPage = 10, isActive }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        value,
        pageCommands,
        pageIndex,
        handleChange,
        currentPage,
        totalPages,
        handleKeyDown,
        availableCommands,
    } = useIdleConsole({
        itemsPerPage,
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
                    {availableCommands.current.length > itemsPerPage ? (
                        <em className='command-pages'>
                            Page {currentPage + 1}/{totalPages}
                        </em>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default IdleConsole;

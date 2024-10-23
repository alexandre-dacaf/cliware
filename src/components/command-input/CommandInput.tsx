import React, {
    useRef,
    useState,
    useContext,
    useEffect,
    KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { TerminalContext } from 'context/TerminalContext';
import { parseCommandArguments } from 'services/utils/parser';
import { PipelineDataCmd } from 'types';
import './CommandInput.css';

interface CommandInputProps {
    onSubmit: (fullCommand: string, args: PipelineDataCmd) => void;
    isActive: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, isActive }) => {
    const { dispatch } = useContext(TerminalContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        const isShiftPressed = event.shiftKey;
        preventDefaultEvents(event);

        if (key === 'Enter') {
            submit();
        }
        if (key === 'Escape') {
            deactivateTerminal();
        }
    };

    const preventDefaultEvents = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const preventDefaultKeys = ['Enter', 'Tab', 'Escape'];

        if (preventDefaultKeys.includes(event.key)) {
            event.preventDefault();
        }
    };

    const submit = () => {
        const command = value.trim();
        if (command !== '') {
            const commandArgs = parseCommandArguments(command);

            onSubmit(command, commandArgs);
            setValue('');
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
            <span className='command-prompt'>$</span>
            <input
                ref={inputRef}
                className='command-input'
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    );
};

export default CommandInput;
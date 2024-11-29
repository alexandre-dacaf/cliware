import React, { useRef, useEffect } from 'react';
import useSelectPrompt from 'hooks/prompts/useSelectPrompt';
import { Prompt } from 'types';
import './SelectPrompt.scss';
import { Radio } from 'components/widgets/Radio';
import { Checkbox } from 'components/widgets/Checkbox';

interface SelectPromptProps {
    message: string;
    choices: Prompt.Choice[];
    multiselect: boolean;
    defaultValue?: any;
    required?: boolean;
    isActive: boolean;
    validate?: Prompt.ValidateFunction;
    onSubmit: (data: Prompt.Choice[] | Prompt.Choice) => void;
    onEscape: () => void;
    onAbort: () => void;
    onGoBack: () => void;
}

const SelectPrompt: React.FC<SelectPromptProps> = ({
    message,
    choices,
    multiselect = false,
    defaultValue,
    required = false,
    validate = () => true,
    isActive,
    onSubmit,
    onEscape,
    onAbort,
    onGoBack,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { selectedIndex, checkedIndexes, handleKeyDown } = useSelectPrompt({
        message,
        choices,
        multiselect,
        defaultValue,
        required,
        validate,
        onSubmit,
        onEscape,
        onAbort,
        onGoBack,
    });

    useEffect(() => {
        if (isActive && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isActive]);

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const relatedTarget = event.relatedTarget as HTMLElement | null;
        if (
            containerRef.current &&
            relatedTarget &&
            !containerRef.current.contains(relatedTarget)
        ) {
            // Focus completelly left containerRef
            containerRef.current.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            className='select-prompt'
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        >
            <div className='select-message'>{message}</div>
            <div className='choices-list'>
                {choices.map((choice, index) => {
                    const isSelected = selectedIndex === index;
                    const isChecked = checkedIndexes.includes(index);

                    if (!multiselect) {
                        return (
                            <Radio
                                isSelected={isSelected}
                                label={choice.label}
                                hint={choice.hint}
                            />
                        );
                    }

                    return (
                        <Checkbox
                            isSelected={isSelected}
                            isChecked={isChecked}
                            label={choice.label}
                            hint={choice.hint}
                        />
                    );
                    // return (
                    //     <div className='choice' key={index}>
                    //         <span
                    //             className={`choice-label ${
                    //                 selectedIndex === index ? 'selected' : ''
                    //             } ${checkedIndexes.includes(index) ? 'checked' : ''}`}
                    //         >
                    //             {choice.label}
                    //         </span>
                    //         {choice.hint ? (
                    //             <span
                    //                 className={`choice-hint ${
                    //                     selectedIndex === index ? 'selected' : ''
                    //                 }`}
                    //             >
                    //                 {choice.hint}
                    //             </span>
                    //         ) : null}
                    //     </div>
                    // );
                })}
            </div>
            <span className='select-navigation-hint'>
                <em>Use arrow keys to navigate, Space to (de)select and Enter to confirm.</em>
            </span>
        </div>
    );
};

SelectPrompt.displayName = 'SelectPrompt';

export { SelectPrompt };

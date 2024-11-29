import React, { useRef, useEffect } from 'react';
import classes from './Radio.module.scss';

interface RadioProps {
    isSelected: boolean;
    label: string;
    hint?: string;
}

const Radio: React.FC<RadioProps> = ({ isSelected, label, hint }) => {
    const selectedClass = isSelected ? classes.selected : '';

    const renderHint = () => {
        return hint && isSelected ? <div className={classes.hint}>{hint}</div> : null;
    };

    return (
        <div className={classes.radio}>
            <div className={`${classes.circle} ${selectedClass}`}></div>
            <div className={`${classes.label} ${selectedClass}`}>{label}</div>
            {renderHint()}
        </div>
    );
};

Radio.displayName = 'Radio';

export { Radio };

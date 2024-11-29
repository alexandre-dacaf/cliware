import React, { useRef, useEffect, useMemo } from 'react';
import classes from './Checkbox.module.scss';
import { Color } from 'types';
import { getColorValue } from 'services';

interface RadioProps {
    isSelected: boolean;
    isChecked: boolean;
    label: string;
    hint?: string;
}

const Checkbox: React.FC<RadioProps> = ({ isSelected, isChecked, label, hint }) => {
    const selectedClass = isSelected ? classes.selected : '';
    const checkedClass = isChecked ? classes.checked : '';

    const renderHint = () => {
        return hint && isSelected ? <div className={classes.hint}>{hint}</div> : null;
    };

    return (
        <div className={classes.checkbox}>
            <div className={`${classes.box} ${selectedClass} ${checkedClass}`}></div>
            <div className={`${classes.label} ${selectedClass}`}>{label}</div>
            {renderHint()}
        </div>
    );
};

Checkbox.displayName = 'Checkbox';

export { Checkbox };

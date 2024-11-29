import React from 'react';
import { defaultTheme } from 'styles/theme';
import { MessagePanel } from 'types';
import './ProgressBar.scss';

const ProgressBar: React.FC<MessagePanel.ProgressBar> = ({ percentage, color }) => {
    const colorPalette = defaultTheme.palette;
    const colorName = color ?? 'neutral-900';
    const colorValue = colorPalette[colorName];

    const trackStyle: React.CSSProperties = { border: `solid 1px ${colorValue}` };
    const barStyle: React.CSSProperties = {
        width: `${percentage}%`,
        backgroundColor: colorValue,
    };

    return (
        <div className='progress-track' style={trackStyle}>
            <div className='progress-bar' style={barStyle} />
        </div>
    );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

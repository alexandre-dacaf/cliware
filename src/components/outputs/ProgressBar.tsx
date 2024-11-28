import { MessagePanel } from 'types';
import './ProgressBar.scss';

const ProgressBar: React.FC<MessagePanel.ProgressBarProps> = ({
    percentage,
    trackStyle,
    barStyle,
    animationKeyframes,
    color,
}) => {
    const colorClass = color ? `color--${color}` : 'color--blue';

    const finalBarStyle = { ...barStyle, width: `${percentage}%` };

    return (
        <div className={`progress-track ${colorClass}`} style={trackStyle}>
            <div className='progress-bar' style={finalBarStyle} />
            <style>{animationKeyframes}</style>
        </div>
    );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

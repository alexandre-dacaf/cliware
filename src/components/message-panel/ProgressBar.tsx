import { MessagePanel } from 'types';
import './ProgressBar.scss';

const ProgressBar: React.FC<MessagePanel.ProgressBar> = ({ percentage, color }) => {
    const colorClass = color ? `color--${color}` : 'color--blue';

    const style = { width: `${percentage}%` };

    return (
        <div className={`progress-track ${colorClass}`}>
            <div className='progress-bar' style={style} />
        </div>
    );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

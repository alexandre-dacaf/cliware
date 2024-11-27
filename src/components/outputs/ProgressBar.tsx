import { ProgressBarCharacters, ProgressBarProps } from 'types';
import './ProgressBar.css';

const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    style = 'arrow',
    totalLength = 20,
    fontSize,
}) => {
    const characters: ProgressBarCharacters = {
        arrow: {
            size: 1,
            start: '[',
            end: ']',
            filled: '=',
            empty: ' ',
            indicator: '>',
        },
        hash: {
            size: 1,
            start: '[',
            end: ']',
            filled: '#',
            empty: ' ',
            indicator: '#',
        },
        blocks: {
            size: 1.5,
            start: '',
            end: '',
            filled: '■',
            empty: '□',
            indicator: '▨',
        },
        slanted: {
            size: 2,
            start: '',
            end: '',
            filled: '▰',
            empty: '▱',
            indicator: '▰',
        },
    };

    const filledLength = Math.floor((percentage / 100) * totalLength);
    const indicatorPosition = filledLength < totalLength ? filledLength : totalLength - 1;

    const styleChars = characters[style];

    let progress = styleChars.start;

    for (let i = 0; i < totalLength; i++) {
        if (i === indicatorPosition) {
            progress += styleChars.indicator;
        } else if (i < filledLength) {
            progress += styleChars.filled;
        } else {
            progress += styleChars.empty;
        }
    }

    progress += styleChars.end;

    const size = fontSize ?? styleChars.size;

    return (
        <pre className='progress-bar' style={{ fontSize: `${size}em` }}>
            {progress}
        </pre>
    );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;

import { useState, useEffect, useMemo } from 'react';
import { MessagePanel } from 'types';

const Spinner: React.FC<MessagePanel.Spinner> = (spinner) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const frames = useMemo(() => getSpinnerFrames(spinner.name), [spinner.name]);
    const defaultInterval = 80;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
        }, spinner.interval ?? defaultInterval);

        return () => clearInterval(interval); // Cleans interval on unmount
    }, [frames.length]);

    return <span>{frames[currentFrame]}</span>;
};

const getSpinnerFrames = (name: MessagePanel.SpinnerName) => {
    const spinners: Record<MessagePanel.SpinnerName, string[]> = {
        dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
        dots3: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
        dots4: ['⠄', '⠆', '⠇', '⠋', '⠙', '⠸', '⠰', '⠠', '⠰', '⠸', '⠙', '⠋', '⠇', '⠆'],
        dots5: [
            '⠋',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
        ],
        dots6: [
            '⠁',
            '⠉',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠤',
            '⠄',
            '⠄',
            '⠤',
            '⠴',
            '⠲',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠚',
            '⠙',
            '⠉',
            '⠁',
        ],
        dots7: [
            '⠈',
            '⠉',
            '⠋',
            '⠓',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠖',
            '⠦',
            '⠤',
            '⠠',
            '⠠',
            '⠤',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
            '⠉',
            '⠈',
        ],
        dots8: [
            '⠁',
            '⠁',
            '⠉',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠤',
            '⠄',
            '⠄',
            '⠤',
            '⠠',
            '⠠',
            '⠤',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
            '⠉',
            '⠈',
            '⠈',
        ],
        dots9: ['⣼', '⣹', '⢻', '⠿', '⡟', '⣏', '⣧', '⣶'],
        line: ['-', '\\', '|', '/'],
        arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
        circleHalves: ['◐', '◓', '◑', '◒'],
    };

    return spinners[name];
};

Spinner.displayName = 'Spinner';

export default Spinner;

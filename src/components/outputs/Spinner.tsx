import { useState, useEffect } from 'react';
import { SpinnerProps } from 'types';

const Spinner: React.FC<SpinnerProps> = (spinner) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % spinner.frames.length);
        }, spinner.interval);

        return () => clearInterval(interval); // Cleans interval on unmount
    }, [spinner.frames.length]);

    return <span>{spinner.frames[currentFrame]}</span>;
};

Spinner.displayName = 'Spinner';

export default Spinner;

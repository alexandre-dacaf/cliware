import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface SlideDownProps {
    children: ReactNode;
    key: React.Key;
    duration?: number;
}

const SlideDown: React.FC<SlideDownProps> = ({ children, key, duration }) => {
    return (
        <motion.div
            key={key}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: duration ?? 0.4, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
        >
            {children}
        </motion.div>
    );
};

export default SlideDown;

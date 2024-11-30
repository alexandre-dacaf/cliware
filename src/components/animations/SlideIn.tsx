import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface SlideInProps {
    children: ReactNode;
    key: React.Key;
    duration?: number;
}

const SlideIn: React.FC<SlideInProps> = ({ children, key, duration }) => {
    return (
        <motion.div
            key={key}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: duration ?? 0.4, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export default SlideIn;

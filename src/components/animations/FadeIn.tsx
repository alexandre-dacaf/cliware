import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface FadeIn {
    children: ReactNode;
    key: React.Key;
    duration?: number;
}

const FadeIn: React.FC<FadeIn> = ({ children, key, duration }) => {
    return (
        <motion.div
            key={key}
            initial={{ y: '20px', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: duration ?? 0.4, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ExpandableProps {
    children: ReactNode;
}

const SlideDown: React.FC<ExpandableProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
        >
            {children}
        </motion.div>
    );
};

export default SlideDown;

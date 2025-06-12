import React, { useState, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-20 h-20"
    >
        <div className="absolute inset-0 border-4 border-t-primary border-r-secondary border-b-tertiary border-l-white rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-secondary border-r-tertiary border-b-white border-l-primary rounded-full animate-spin-reverse"></div>
    </motion.div>
);

const FeedbackLoadingWrapper = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
        >
            {isLoading ? <LoadingSpinner /> : <FeedbackForm />}
        </motion.div>
    );
};

export default FeedbackLoadingWrapper; 
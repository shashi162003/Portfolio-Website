import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const techJokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer go broke? Because he used up all his cache!",
    "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
    "Why did the JavaScript developer go to therapy? Because he had too many unresolved promises!",
    "Why did the computer go to the doctor? Because it had a virus!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer quit his job? Because he didn't get arrays!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer quit his job? Because he didn't get arrays!",
    "Why do programmers prefer dark mode? Because light attracts bugs!"
];

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [currentJoke, setCurrentJoke] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, 20); // Update every 20ms for smooth animation

        const jokeTimer = setInterval(() => {
            setCurrentJoke((prev) => (prev + 1) % techJokes.length);
        }, 3000); // Change joke every 3 seconds

        return () => {
            clearInterval(timer);
            clearInterval(jokeTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-4xl font-medium mb-8"
                >
                    Loading Awesome Stuff...
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white text-xl mb-8 max-w-2xl px-4 leading-relaxed"
                >
                    {techJokes[currentJoke]}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                        className="h-full bg-white"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white text-sm mt-2"
                >
                    {progress}%
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen; 
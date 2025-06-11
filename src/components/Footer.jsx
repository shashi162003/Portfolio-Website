import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Social Links */}
                    <div className="flex space-x-6">
                        <motion.a
                            href="https://github.com/shashi162003"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <FaGithub className="w-6 h-6" />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/in/shashi-kumar-gupta-36668b239"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <FaLinkedin className="w-6 h-6" />
                        </motion.a>
                        <motion.a
                            href="mailto:shashikumargupta443@gmail.com"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <FaEnvelope className="w-6 h-6" />
                        </motion.a>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-400 text-sm">
                        © {currentYear} Shashi Kumar Gupta. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
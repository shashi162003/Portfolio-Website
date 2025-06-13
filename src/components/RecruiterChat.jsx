import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

// Initialize EmailJS
emailjs.init('HFU-o5X_Yau3iXA6v');

const RecruiterChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        projectDetails: '',
        meetingPreference: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading('Sending your message...');

        try {
            // Send notification email to you (the portfolio owner)
            await emailjs.send(
                'service_68dha8k',
                'template_jpmpfba',
                {
                    from_name: formData.name,
                    to_name: "Shashi",
                    from_email: formData.email,
                    message: `New Recruiter Inquiry:

Company: ${formData.company}
Project Details: ${formData.projectDetails}
Meeting Preference: ${formData.meetingPreference}

Contact Information:
Name: ${formData.name}
Email: ${formData.email}`,
                },
                'HFU-o5X_Yau3iXA6v'
            );

            // Send confirmation email to the recruiter using the confirmation template
            await emailjs.send(
                'service_68dha8k',
                'user_confirm',
                {
                    to_name: formData.name,
                    from_name: "Shashi",
                    from_email: "shashi@devshashi.dev",
                    to_email: formData.email,
                    message_content: `Thank you for reaching out! I've received your inquiry and will get back to you soon.

Here's a summary of your request:
- Company: ${formData.company}
- Preferred Meeting Time: ${formData.meetingPreference}
- Project Details: ${formData.projectDetails}

I'll review your request and contact you shortly to schedule our meeting.

Best regards,
Shashi`,
                },
                'HFU-o5X_Yau3iXA6v'
            );

            toast.success('Message sent successfully!', {
                id: loadingToast,
            });
            setIsOpen(false);
            setStep(1);
            setFormData({
                name: '',
                email: '',
                company: '',
                projectDetails: '',
                meetingPreference: '',
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.', {
                id: loadingToast,
            });
            console.error('Email error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-tertiary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition-colors duration-300 z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaComments className="text-white text-2xl" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-8 w-96 bg-tertiary rounded-lg shadow-xl p-6 z-50"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-secondary"
                        >
                            <FaTimes />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-white text-xl font-bold">Hey there! 👋</h3>
                            <p className="text-gray-300 mt-2">
                                {step === 1
                                    ? "I'd love to hear about your opportunity. Let's start with some basic details!"
                                    : "Great! Now let's talk about the project and schedule a meeting."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                        className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:outline-none"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your Email"
                                        className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:outline-none"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company Name"
                                        className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full py-2 bg-secondary text-white rounded hover:bg-secondary/80 transition-colors duration-300 flex items-center justify-center space-x-2"
                                        disabled={loading}
                                    >
                                        <span>Next</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <textarea
                                        name="projectDetails"
                                        value={formData.projectDetails}
                                        onChange={handleChange}
                                        placeholder="Tell me about the project or opportunity"
                                        className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:outline-none h-24 resize-none"
                                        required
                                        disabled={loading}
                                    />
                                    <select
                                        name="meetingPreference"
                                        value={formData.meetingPreference}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Select Meeting Preference</option>
                                        <option value="morning">Morning (9 AM - 12 PM)</option>
                                        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                        <option value="evening">Evening (5 PM - 9 PM)</option>
                                        <option value="night">Late Night (9 PM - 12 AM)</option>
                                    </select>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-1/2 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
                                            disabled={loading}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 py-2 bg-secondary text-white rounded hover:bg-secondary/80 transition-colors duration-300 flex items-center justify-center space-x-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <span>Send</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RecruiterChat;

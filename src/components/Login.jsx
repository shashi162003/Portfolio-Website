import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { sendOTP, verifyOTP, otpSent } = useAuth();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@[\w-]+(?:\.[\w-]+)*\.[a-zA-Z]{2,}$/;

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setLoading(true);

        try {
            await sendOTP(email);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOTP(otp);
            navigate('/blog');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white">
                        {otpSent ? 'Enter OTP' : 'Login / Register'}
                    </h2>
                    <p className="mt-2 text-gray-300">
                        {otpSent
                            ? 'We have sent a one-time password to your email'
                            : 'Enter your email to receive a one-time password'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {otpSent ? (
                    <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-white mb-2">
                                One-Time Password
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                                placeholder="Enter the 6-digit code"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/blog')}
                            className="w-full px-6 py-3 border border-tertiary rounded-lg text-white font-medium hover:bg-tertiary/10 transition-all"
                        >
                            Back to Blogs
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/blog')}
                            className="w-full px-6 py-3 border border-tertiary rounded-lg text-white font-medium hover:bg-tertiary/10 transition-all"
                        >
                            Back to Blogs
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
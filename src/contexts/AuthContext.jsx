import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await fetch(`${config.apiUrl}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async (email) => {
        try {
            const response = await fetch(`${config.apiUrl}/api/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmail(email);
                setOtpSent(true);
                toast.success('OTP sent successfully!');
                return true;
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to send OTP.');
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Error sending OTP.');
            throw error;
        }
    };

    const verifyOTP = async (otp) => {
        try {
            const response = await fetch(`${config.apiUrl}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                setOtpSent(false);
                toast.success('Logged in successfully!');
                return true;
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to verify OTP.');
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Error verifying OTP.');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully!');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        otpSent,
        email,
        sendOTP,
        verifyOTP,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 
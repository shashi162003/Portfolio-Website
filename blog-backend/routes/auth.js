const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        // Generate OTP
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name: email.split('@')[0] // Default name from email
            });
        }

        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your OTP for Blog Login',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
                        <h2 style="color: #333; margin: 0;">Blog Login OTP</h2>
                    </div>
                    <div style="padding: 30px; text-align: center;">
                        <p style="font-size: 16px; color: #555; line-height: 1.5;">Hello,</p>
                        <p style="font-size: 16px; color: #555; line-height: 1.5;">Thank you for logging in. Please use the following One-Time Password (OTP) to complete your login:</p>
                        <h1 style="font-size: 32px; color: #007bff; margin: 25px 0; letter-spacing: 2px;"><strong>${otp}</strong></h1>
                        <p style="font-size: 14px; color: #888; line-height: 1.5;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                    </div>
                    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd;">
                        <p>&copy; ${new Date().getFullYear()} Your Blog Name. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP'
        });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.verifyOTP(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Clear OTP
        user.clearOTP();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP'
        });
    }
});

// Get current user
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user'
        });
    }
});

module.exports = router; 
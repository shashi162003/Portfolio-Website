const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    avatar: {
        type: String,
        // Default will be set in a pre-save hook
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    otp: {
        code: String,
        expiresAt: Date
    }
}, {
    timestamps: true
});

// Pre-save hook to generate DiceBear avatar for new users if not provided
userSchema.pre('save', async function (next) {
    if (this.isNew && !this.avatar) {
        try {
            const { createAvatar } = await import('@dicebear/core');
            const { rings } = await import('@dicebear/collection');

            const avatar = createAvatar(rings, {
                seed: this.email, // Use email as the seed for unique avatar
                radius: 50,
            });
            this.avatar = await avatar.toDataUri(); // Await the asynchronous method
        } catch (error) {
            console.error('Error generating DiceBear avatar:', error);
            // Optionally, set a fallback avatar or throw an error
            this.avatar = 'https://res.cloudinary.com/dtdt1c9og/image/upload/v1709892607/blog-media/default_user_avatar.png'; // Fallback
        }
    }
    next();
});

// Generate OTP
userSchema.methods.generateOTP = function () {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 minutes from now)
    this.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (otp) {
    if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
        return false;
    }

    // Check if OTP is expired
    if (Date.now() > this.otp.expiresAt) {
        this.clearOTP();
        return false;
    }

    // Check if OTP matches
    const isValid = this.otp.code === otp;

    if (isValid) {
        this.clearOTP();
    }

    return isValid;
};

// Clear OTP
userSchema.methods.clearOTP = function () {
    this.otp = undefined;
};

// Generate JWT
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
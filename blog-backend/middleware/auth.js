const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to perform this action'
            });
        }
        next();
    };
};

exports.authorizeBlogCreation = (req, res, next) => {
    const authorizedEmails = ['shashikumargupta443@gmail.com', 'shashi@devshashi.dev'];

    if (!authorizedEmails.includes(req.user.email)) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to create blog posts'
        });
    }

    next();
}; 
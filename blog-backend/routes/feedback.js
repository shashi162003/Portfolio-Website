const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Route to submit feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
        }

        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();

        res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, message: 'Error submitting feedback.', error: error.message });
    }
});

module.exports = router; 
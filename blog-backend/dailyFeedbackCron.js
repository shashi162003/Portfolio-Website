const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Feedback = require('./models/Feedback');
const dotenv = require('dotenv');
dotenv.config();

// Configure your transporter using existing env variable names
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

function formatFeedbacks(feedbacks) {
    if (!feedbacks.length) return 'No feedbacks received today.';
    return feedbacks.map((f, i) =>
        `#${i + 1}\nName: ${f.name}\nEmail: ${f.email}\nMessage:\n${f.message}\nReceived: ${f.createdAt.toLocaleString()}\n-----------------------------`
    ).join('\n\n');
}

// Cron job: every day at 8:00 AM server time
cron.schedule('0 8 * * *', async () => {
    try {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const feedbacks = await Feedback.find({
            createdAt: { $gte: start, $lte: end }
        });

        const feedbackList = formatFeedbacks(feedbacks);

        if (!feedbacks.length) return;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: 'shashi@devshashi.dev',
            subject: `Daily Feedback Report (${start.toLocaleDateString()})`,
            text: `Feedbacks received today:\n\n${feedbackList}`
        });
        console.log('Daily feedback email sent.');
    } catch (err) {
        console.error('Error sending daily feedback email:', err);
    }
});

// Test email with actual feedbacks (run on startup except in production)
if (process.env.NODE_ENV !== 'production') {
    (async () => {
        try {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);

            const feedbacks = await Feedback.find({
                createdAt: { $gte: start, $lte: end }
            });

            const feedbackList = formatFeedbacks(feedbacks);

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: 'shashi@devshashi.dev',
                subject: 'Test: Daily Feedbacks (Formatted)',
                text: `Here are your feedbacks for today (test):\n\n${feedbackList}`
            });
            console.log('Test feedback email sent successfully.');
        } catch (err) {
            console.error('Error sending test feedback email:', err);
        }
    })();
}

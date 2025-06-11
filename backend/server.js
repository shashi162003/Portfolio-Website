const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://devshashi.dev', 'http://localhost:5173'],
    methods: ['POST', 'GET'],
    credentials: false
}));
app.use(express.json());

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email to you
    const mailOptions = {
        from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);

        // Confirmation email to user
        const confirmationMailOptions = {
            from: `Shashi <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "We've received your message!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 2px 8px #f0f0f0;">
                    <div style="background: #4f46e5; color: #fff; padding: 24px 16px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">Thank you for reaching out, ${name}!</h2>
                    </div>
                    <div style="padding: 24px 16px;">
                        <p>Hi ${name},</p>
                        <p>Thank you for contacting me through my portfolio website. I have received your message and will get back to you as soon as possible.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                        <p style="font-size: 15px; color: #555;"><strong>Your message:</strong></p>
                        <blockquote style="background: #f9f9f9; border-left: 4px solid #4f46e5; margin: 0; padding: 12px 16px; color: #333;">${message}</blockquote>
                        <p style="margin-top: 32px; font-size: 14px; color: #888;">Best regards,<br/>Shashi</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(confirmationMailOptions);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email.', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Feedback = require('./models/Feedback');

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const feedbacks = await Feedback.find({ createdAt: { $gte: start, $lte: end } });
    console.log(feedbacks);
    process.exit();
})();

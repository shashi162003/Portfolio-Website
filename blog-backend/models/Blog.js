const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    media: [{
        type: {
            type: String,
            enum: ['image', 'video', 'pdf'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Add indexes for better query performance
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ createdAt: -1 }); // For sorting by latest

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog; 
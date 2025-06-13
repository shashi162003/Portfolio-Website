const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { protect, authorizeBlogCreation, isAdmin } = require('../middleware/auth');

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error('Error getting blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting blogs'
        });
    }
});

// Get single blog
router.get('/:id', async (req, res) => {
    try {
        console.log(`[Backend] Fetching blog with ID: ${req.params.id}`);
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name email avatar')
            .populate('comments.author', 'name email avatar');

        if (!blog) {
            console.log(`[Backend] Blog not found for ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        console.log(`[Backend] Blog found for ID: ${req.params.id}`);

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error getting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting blog'
        });
    }
});

// Create blog
router.post('/', protect, authorizeBlogCreation, async (req, res) => {
    try {
        const { title, excerpt, content, coverImage, media } = req.body;

        const blog = await Blog.create({
            title,
            excerpt,
            content,
            coverImage,
            media,
            author: req.user._id
        });

        await blog.populate('author', 'name email avatar');

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating blog'
        });
    }
});

// Update blog
router.put('/:id', protect, authorizeBlogCreation, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name email avatar');

        res.json({
            success: true,
            data: updatedBlog
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog'
        });
    }
});

// Delete blog
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        } await Blog.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog'
        });
    }
});

// Like/Unlike blog
router.post('/:id/like', protect, async (req, res) => {
    try {
        console.log(`[Backend] Like/Unlike request for blog ID: ${req.params.id}, User ID: ${req.user._id}`);
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            console.log(`[Backend] Blog not found for like/unlike, ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        console.log(`[Backend] Blog found for like/unlike, ID: ${req.params.id}`);

        const likeIndex = blog.likes.indexOf(req.user._id);

        if (likeIndex === -1) {
            blog.likes.push(req.user._id);
        } else {
            blog.likes.splice(likeIndex, 1);
        }

        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error liking/unliking blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error liking/unliking blog'
        });
    }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
    try {
        const { content } = req.body;
        console.log(`[Backend] Comment request for blog ID: ${req.params.id}, User ID: ${req.user._id}, Content: \'${content}\'`);
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            console.log(`[Backend] Blog not found for comment, ID: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        console.log(`[Backend] Blog found for comment, ID: ${req.params.id}`);

        blog.comments.push({
            content,
            author: req.user._id
        });

        await blog.save();

        // Populate author for the newly added comment before sending response
        await blog.populate('comments.author', 'name email avatar');

        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting comment'
        });
    }
});

// Delete comment
router.delete('/:blogId/comment/:commentId', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Find the comment
        const comment = blog.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const adminEmails = ['shashikumargupta443@gmail.com', 'shashi@devshashi.dev'];
        const isAdmin = adminEmails.includes(req.user.email);        // Check if user is the comment author or is admin
        if (comment.author.toString() !== req.user._id.toString() && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        // Remove the comment from the comments array
        blog.comments = blog.comments.filter(c => c._id.toString() !== req.params.commentId);
        await blog.save();

        await blog.populate('author', 'name email avatar');
        await blog.populate('comments.author', 'name email avatar');

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting comment'
        });
    }
});

module.exports = router;
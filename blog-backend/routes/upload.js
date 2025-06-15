const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }, fileFilter: (req, file, cb) => {
        // Accept images, videos, and PDFs
        if (
            file.mimetype.startsWith('image/') ||
            file.mimetype.startsWith('video/') ||
            file.mimetype === 'application/pdf'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
        }
    },
});

// Upload media
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: 'blog-media'
        });

        res.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                type: req.file.mimetype.startsWith('image/') ? 'image' : 'video'
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file'
        });
    }
});

// Delete media
router.delete('/:publicId', protect, async (req, res) => {
    try {
        const { publicId } = req.params;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file'
        });
    }
});

module.exports = router; 
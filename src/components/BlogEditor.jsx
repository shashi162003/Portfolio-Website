import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import config from '../config';

const BlogEditor = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
            },
        },
    });

    const handleImageUpload = async (file) => {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${config.apiUrl}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Image uploaded successfully!');
                return data.data.url;
            } else {
                console.error('Error uploading image:', data.message);
                toast.error(data.message || 'Failed to upload image.');
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image.');
            return null;
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !excerpt || !editor?.getHTML()) {
            toast.error('Please fill in all fields (title, excerpt, and content).');
            return;
        }

        setLoading(true);
        try {
            let coverImageUrl = '';
            if (coverImage) {
                const uploadedUrl = await handleImageUpload(coverImage);
                if (uploadedUrl) {
                    coverImageUrl = uploadedUrl;
                } else {
                    setLoading(false);
                    return;
                }
            } else {
                coverImageUrl = 'https://res.cloudinary.com/dtdt1c9og/image/upload/v1709892607/blog-media/default_blog_cover.jpg';
            }

            const response = await fetch(`${config.apiUrl}/api/blogs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content: editor.getHTML(),
                    coverImage: coverImageUrl
                }),
            });

            if (response.ok) {
                toast.success('Blog post created successfully!');
                navigate('/blog');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to create blog post.');
                throw new Error(errorData.message || 'Failed to create blog post');
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
            toast.error(`Failed to create blog post: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addImage = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const uploadedUrl = await handleImageUpload(file);
                if (uploadedUrl) {
                    editor?.chain().focus().setImage({ src: uploadedUrl }).run();
                } else {
                    toast.error('Failed to insert image.');
                }
            }
        };
        input.click();
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    if (!user || !['shashikumargupta443@gmail.com', 'shashi@devshashi.dev'].includes(user.email)) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
                    <p className="text-gray-300 mb-8">You don't have permission to create blog posts.</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all"
                    >
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/blog')}
                    className="mb-8 flex items-center gap-2 text-white hover:text-tertiary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Blogs
                </button>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-white mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                            placeholder="Enter blog title"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                            placeholder="Enter a brief excerpt"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Content</label>
                        <div className="bg-tertiary rounded-lg p-4">
                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.5 15.5h-7a1 1 0 01-1-1v-9a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1zm-7-11v9h7v-9h-7z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H8a1 1 0 110-2h1V8H8a1 1 0 010-2h1V5a1 1 0 011-1z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={`p-2 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="p-2 rounded hover:bg-white/10 flex items-center gap-1"
                                >
                                    {imageUploading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Add Image
                                </button>
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="p-2 rounded hover:bg-white/10"
                                >
                                    Add Link
                                </button>
                            </div>
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || imageUploading}
                        className="w-full px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Saving...' : 'Create Blog Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BlogEditor;
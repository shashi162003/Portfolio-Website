import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import config from '../config';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    useEffect(() => {
        if (blog && user) {
            setLiked(blog.likes.includes(user._id));
        } else {
            setLiked(false);
        }
    }, [blog, user]);

    const isAdminUser = user && (user.email === 'shashi@devshashi.dev' || user.email === 'shashikumargupta443@gmail.com');

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/blogs/${id}`);
            const result = await response.json();
            if (result.success) {
                console.log('Blog data received:', result.data);
                setBlog(result.data);
            } else {
                console.error('Error fetching blog:', result.message);
                setBlog(null);
                toast.error(result.message || 'Failed to fetch blog post.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog:', error);
            setLoading(false);
            toast.error('Error fetching blog post.');
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            toast.error('Please log in to like a post.');
            return;
        }

        setLoadingLike(true);
        try {
            const response = await fetch(`${config.apiUrl}/api/blogs/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const result = await response.json();
            if (result.success) {
                const isNowLiked = !liked;
                setLiked(isNowLiked);
                setBlog({
                    ...blog,
                    likes: isNowLiked
                        ? [...blog.likes, user._id]
                        : blog.likes.filter(id => id !== user._id)
                });
                toast.success(isNowLiked ? 'Post liked!' : 'Post unliked!');
            } else {
                console.error('Error liking blog:', result.message);
                toast.error(result.message || 'Failed to like blog.');
            }
        } catch (error) {
            console.error('Error liking blog:', error);
            toast.error('Failed to like blog. Please try again.');
        } finally {
            setLoadingLike(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            toast.error('Please log in to comment.');
            return;
        }
        if (!comment.trim()) {
            toast.error('Comment cannot be empty.');
            return;
        }

        setLoadingComment(true);
        try {
            const response = await fetch(`${config.apiUrl}/api/blogs/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: comment }),
            });
            const result = await response.json();
            if (result.success) {
                setBlog(result.data);
                setComment('');
                toast.success('Comment posted successfully!');
            } else {
                console.error('Error posting comment:', result.message);
                toast.error(result.message || 'Failed to post comment.');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment. Please try again.');
        } finally {
            setLoadingComment(false);
        }
    };

    const deleteComment = async (commentId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const response = await fetch(`${config.apiUrl}/api/blogs/${id}/comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                const result = await response.json();
                if (result.success) {
                    setBlog(result.data);
                    toast.success('Comment deleted successfully!');
                } else {
                    toast.error(result.message || 'Failed to delete comment.');
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error('Failed to delete comment.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-tertiary"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Blog Not Found</h1>
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
        <div className="pt-20 min-h-screen bg-primary">
            <div className="container mx-auto px-4 py-8">
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

                    <article className="bg-tertiary rounded-lg overflow-hidden">
                        {isAuthenticated && isAdminUser && (
                            <div className="flex justify-end p-4">
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this blog post?')) {
                                            try {
                                                const response = await fetch(`${config.apiUrl}/api/blogs/${id}`, {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                                    }
                                                });
                                                const result = await response.json();
                                                if (result.success) {
                                                    toast.success('Blog post deleted successfully!');
                                                    navigate('/blog');
                                                } else {
                                                    toast.error(result.message || 'Failed to delete blog post.');
                                                }
                                            } catch (error) {
                                                console.error('Error deleting blog:', error);
                                                toast.error('Failed to delete blog post.');
                                            }
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-white mb-4">{blog.title}</h1>
                            <div className="flex items-center gap-4 text-gray-400 mb-8">
                                <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
                                <span>•</span>
                                <span>{blog.author.name}</span>
                            </div>

                            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>
                    </article>

                    <div className="mt-8">
                        <button
                            onClick={handleLike}
                            disabled={loadingLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${liked ? 'bg-red-500 hover:bg-red-600' : 'bg-tertiary hover:bg-tertiary/80'} ${loadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loadingLike && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {blog.likes.length} {blog.likes.length === 1 ? 'Like' : 'Likes'}
                        </button>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Comments ({blog.comments.length})</h2>
                        <form onSubmit={handleComment} className="mb-8">
                            <textarea
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onFocus={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
                                className="w-full p-4 bg-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tertiary"
                                rows="4"
                                disabled={!isAuthenticated || loadingComment}
                            />
                            <button
                                type="submit"
                                className="mt-4 px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={!isAuthenticated || !comment.trim() || loadingComment}
                            >
                                {loadingComment && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loadingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>

                        <div className="space-y-6">
                            {blog.comments.map((comment) => (
                                <div key={comment._id} className="bg-tertiary rounded-lg p-6">
                                    <div className="flex items-center gap-4">
                                        {comment.author && (
                                            <>
                                                <img
                                                    src={comment.author.avatar}
                                                    alt={comment.author.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-white">{comment.author.name}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {format(new Date(comment.createdAt), 'MMM dd, yyyy • h:mm a')}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        {user && comment.author && (user._id === comment.author._id || isAdminUser) && (
                                            <button
                                                onClick={() => deleteComment(comment._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Delete Comment
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-300 mt-4">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
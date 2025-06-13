import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import config from '../config';
import { Navbar } from './';
import { styles } from "../styles";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/blogs`);
            const result = await response.json();

            if (result.success) {
                setBlogs(result.data);
            } else {
                console.error('Error fetching blogs:', result.message);
                setBlogs([]); // Set to empty array on error
                toast.error(result.message || 'Failed to fetch blog posts.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setLoading(false);
            toast.error('Error fetching blog posts.');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-primary flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-tertiary"></div>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/blog/${blog._id}`}
                            className="bg-tertiary rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="aspect-video relative">
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-white mb-2">{blog.title}</h2>
                                <p className="text-gray-300 mb-4 line-clamp-3">{blog.excerpt}</p>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                            </svg>
                                            {blog.likes.length}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>
                                            {blog.comments.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
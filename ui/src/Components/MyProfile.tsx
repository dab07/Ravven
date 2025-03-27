import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { Post } from "../type/Post";
import Blog from './Blogs';
import '../css/Myprofile.css';

const MyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Profile Edit State
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Blog Edit States
    const [editingBlogs, setEditingBlogs] = useState<{[key: string]: boolean}>({});
    const [editedPost, setEditedPost] = useState<{[key: string]: Partial<Post>}>({});

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/getpost', {
                    credentials: 'include'
                });
                const data: Post[] = await response.json();
                const filteredPosts = data.filter(post =>
                    (post.author as any)?._id === user?._id
                );
                setUserPosts(filteredPosts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts', error);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/updateProfile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Update error', error);
        }
    };

    const handleBlogUpdate = async (postId: string) => {
        try {
            const post = editedPost[postId];
            const response = await fetch(`http://localhost:3000/updatePost/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(post)
            });

            if (response.ok) {
                // Update local state
                const updatedPost = await response.json();
                setUserPosts(userPosts.map(p =>
                    p._id === postId ? updatedPost : p
                ));

                // Exit edit mode for this post
                setEditingBlogs({
                    ...editingBlogs,
                    [postId]: false
                });
            }
        } catch (error) {
            console.error('Blog update error', error);
        }
    };

    const handleDeleteBlog = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/deletePost/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                // Remove post from local state
                setUserPosts(userPosts.filter(p => p._id !== postId));
            }
        } catch (error) {
            console.error('Blog delete error', error);
        }
    };

    const handleEditPostChange = (postId: string, field: keyof Post, value: string) => {
        setEditedPost({
            ...editedPost,
            [postId]: {
                ...editedPost[postId],
                [field]: value
            }
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile">
            <div className="main-profile">
                <h1>Your Profile</h1>
            </div>

            <div className={`profile-edit ${isEditing ? 'editing' : ''}`}>
                {!isEditing ? (
                    <div>
                        <h2>{username}</h2>
                    </div>
                ) : (
                    <form onSubmit={handleProfileUpdate}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </form>
                )}
            </div>

            <div className="user-post-counts">
                <span>Posts: {userPosts.length}</span>
            </div>

            <div className="profile-edit">
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <div className="main-post">
                <h2>Your Posts</h2>
            </div>

            <div className="user-posts">
                {userPosts.map(post => (
                    <div key={post._id} className="blog-wrapper">
                        {editingBlogs[post._id] ? (
                            <div className="blog-edit-form">
                                <input
                                    value={editedPost[post._id]?.title || post.title}
                                    onChange={(e) => handleEditPostChange(post._id, 'title', e.target.value)}
                                    placeholder="Title"
                                />
                                <textarea
                                    value={editedPost[post._id]?.summary || post.summary}
                                    onChange={(e) => handleEditPostChange(post._id, 'summary', e.target.value)}
                                    placeholder="Summary"
                                />
                                <textarea
                                    value={editedPost[post._id]?.content || post.content}
                                    onChange={(e) => handleEditPostChange(post._id, 'content', e.target.value)}
                                    placeholder="Content"
                                />
                                <div className="blog-edit-actions">
                                    <button onClick={() => handleBlogUpdate(post._id)}>Save</button>
                                    <button onClick={() => setEditingBlogs({
                                        ...editingBlogs,
                                        [post._id]: false
                                    })}>Cancel</button>
                                    <button onClick={() => handleDeleteBlog(post._id)}>Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div className="blog-display">
                                <Blog post={post} />
                                <div className="blog-actions">
                                    <button
                                        className="edit-blog-btn"
                                        onClick={() => {
                                            // Reset edited post state
                                            setEditedPost({
                                                ...editedPost,
                                                [post._id]: {
                                                    title: post.title,
                                                    summary: post.summary,
                                                    content: post.content
                                                }
                                            });
                                            setEditingBlogs({
                                                ...Object.keys(editingBlogs).reduce((acc, key) => ({
                                                    ...acc,
                                                    [key]: false
                                                }), {}),
                                                [post._id]: true
                                            });
                                        }}
                                    >
                                        ✎
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProfile;

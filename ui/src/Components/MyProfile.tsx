import React, { useEffect, useState } from 'react';
import Blog from './Blogs';
import { Post } from "../type/Post";
import { useAuth } from "../Context/AuthContext";
import '../css/Blogs.css';

const MyProfile = () => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // State for profile editing
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for post editing
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Access user ID safely with type assertion
    const userId = user ? (user as any)._id : null;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        fetch(`http://localhost:3000/getpost`, {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: Post[]) => {
                console.log("All posts:", data);

                const filteredPosts = data.filter(post => {
                    const postAuthor = (post as any).author;
                    if (!postAuthor) return false;

                    if (typeof postAuthor === 'string') {
                        return postAuthor === userId;
                    } else if (typeof postAuthor === 'object') {
                        return postAuthor._id === userId;
                    }
                    return false;
                });

                setUserPosts(filteredPosts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [userId]);

    // Profile update handler
    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        fetch('http://localhost:3000/updateProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username,
                // Only include password if it's being changed
                ...(password && { password })
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update profile');
                return response.json();
            })
            .then(updatedUser => {
                // Update user in auth context
                if (updatedUser) updatedUser(updatedUser);
                setIsEditingProfile(false);
                setPassword('');
                setConfirmPassword('');
                alert('Profile updated successfully');
            })
            .catch(err => {
                console.error('Error updating profile:', err);
                alert('Failed to update profile');
            });
    };

    // Function to handle post deletion
    const handleDeletePost = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            fetch(`http://localhost:3000/myprofile/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to delete post');
                    // Remove the deleted post from state
                    setUserPosts(userPosts.filter(post => post._id !== postId));
                    alert('Post deleted successfully');
                })
                .catch(err => {
                    console.error('Error deleting post:', err);
                    alert('Failed to delete post');
                });
        }
    };

    // Function to handle editing a post
    const handleEditPost = (postId: string) => {
        // Set the ID of the post being edited
        setEditingPostId(postId);
        // You would typically redirect to an edit page or open a modal
        // For simplicity, let's assume you redirect
        window.location.href = `/editpost/${postId}`;
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>

            {isEditingProfile ? (
                <div className="edit-profile-form">
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="user-info">
                    <h2>{user?.username || 'User'}</h2>
                    <button onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                </div>
            )}

            <h2>My Posts</h2>
            {(!userPosts || userPosts.length === 0) ? (
                <div>You haven't created any posts yet</div>
            ) : (
                <div className="posts-container">
                    {userPosts.map(post => (
                        <div key={post._id} className="post-with-actions">
                            <Blog key= {post._id} post={post} />
                            <div className="post-actions">
                                <button onClick={() => handleEditPost(post._id)}>Edit</button>
                                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProfile;

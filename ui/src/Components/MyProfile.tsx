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

                // Filter posts belonging to current user
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

    // Rest of your component code

    return (
        <div>
            <h1>My Profile</h1>
            <div className="user-info">
                <h2>{user?.username || 'User'}</h2>
            </div>

            <h2>My Posts</h2>
            {(!userPosts || userPosts.length === 0) ? (
                <div>You haven't created any posts yet</div>
            ) : (
                <div className="posts-container">
                    {userPosts.map(post => (
                        // Pass post without isUserPost prop to avoid the error
                        <Blog key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProfile;

import React, { useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { Post } from "../type/Post";
import '../css/Myprofile.css';
import Blog from "./Blogs";

const MyProfile = () => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

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
            } catch (error) {
                console.error('Error fetching posts', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchUserPosts();
        }
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile">
            <div className="main-profile">
                <h1>Your Profile</h1>
            </div>
            <div className="profile-info">
                <p><strong>Username:</strong> {user?.username}</p>
            </div>

            <div className="main-profile">
                <h1>Your Posts</h1>
            </div>
            <div className="user-posts">
                {userPosts.map(post => (
                    <Blog key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default MyProfile;

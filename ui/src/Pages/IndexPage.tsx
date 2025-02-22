import React, { useEffect, useState } from 'react';
import Blog from '../Components/Blogs';

const IndexPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3000/getpost', {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Received posts:", data); // Debug log
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!posts || posts.length === 0) {
        return <div>No posts found</div>;
    }

    return (
        <div className="posts-container">
            {posts.map(post => (
                <Blog key={post._id} post={post} />
            ))}
        </div>
    );
};

export default IndexPage;

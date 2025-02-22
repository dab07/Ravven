import React from 'react';
import '../css/App.css';
import { formatISO9075 } from 'date-fns';

const Blogs = ({ post }) => {
    if (!post) {
        return null; // Or a loading state
    }

    console.log("Post data:", post); // Debug log to see what we're receiving

    return (
        <div className="blogs">
            <div className="image">
                {post.image && (
                    <img
                        src={`http://localhost:3000/uploads/${post.image}`}
                        alt={post.title}
                    />
                )}
            </div>
            <div className="blogInfo">
                <h2>{post.title || 'Untitled'}</h2>
                <p className="about">
                    <span className="author">
                        {post.author?.username || 'Anonymous'}
                    </span>
                    <time>
                        {post.createdAt ? formatISO9075(new Date(post.createdAt)) : 'No date'}
                    </time>
                </p>
                <p className="blogDescription">{post.summary || post.content || 'No content'}</p>
            </div>
        </div>
    );
};

export default Blogs;

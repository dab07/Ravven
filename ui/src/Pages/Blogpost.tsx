import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { Post } from "../type/Post";
import '../css/Blogpost.css'
import {useNavigate} from "react-router-dom";

export const Blogpost = () => {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    // Try to get post from location state first
    const post: Post | undefined = location.state?.post;

    if (!post) {
        // Fallback if no post in state (e.g., direct navigation)
        return <div>Post not found</div>;
    }

    return (
        <div className="blog-post-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            <div className="blog-post-grid">
                <div className="blog-post-image">
                    {post.image && (
                        <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} />
                    )}
                </div>

                <div className="blog-post-title">
                    <h2 className="title">{post.title || 'Untitled'}</h2>
                </div>

                <div className="blog-post-meta">
                    <p>
                        <span className="author">{post.author?.username || 'Anonymous'}</span>
                        <time className="date">
                            {post.createdAt ? formatISO9075(new Date(post.createdAt)) : 'No date'}
                        </time>
                        <p className="blog-summary">{post.summary || 'No summary'}</p>
                    </p>
                </div>

                <div className="blog-post-content">
                    <p>{post.content}</p>
                </div>
            </div>
        </div>
    );
};

export default Blogpost;

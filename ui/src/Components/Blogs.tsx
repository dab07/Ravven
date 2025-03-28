import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import { Post } from '../type/Post';
import '../css/Blogs.css';
import Comments from "./Comments";
import Like from "./Like";

type BlogProps = {
    post: Post;
}

const Blogs = ({ post }: BlogProps) => {
    const navigate = useNavigate();

    const handlePostClick = () => {
        navigate(`/post/${post._id}`, { state: { post } });
    };

    return (
        <div className="blog-card" onClick={handlePostClick}>
            <div className="blog-image">
                {post.image && (
                    <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} />
                )}
            </div>

            <div className="blog-meta">
                <span className="author">{post.author?.username || 'Anonymous'}</span>
                <time className="date">{post.createdAt ? formatISO9075(new Date(post.createdAt)) : 'No date'}</time>
            </div>

            <div className="blog-info">
                <h2 className="title">{post.title || 'Untitled'}</h2>
                <p className="blog-summary">{post.summary || post.content || 'No content'}</p>
            </div>

            <div className="blog-interactions">
                <Like
                    postId={post._id}
                    initialLikes={post.likes}
                />
                <Comments
                    postId={post._id}
                    initialComments={post.comments}
                />
            </div>
        </div>
    );
};

export default Blogs;

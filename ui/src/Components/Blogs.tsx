import React, { useState } from 'react';
import { formatISO9075 } from 'date-fns';
import { Post } from '../type/Post';
import '../css/Blogs.css';

const Blogs = ({ post }: { post: Post | null }) => {
    const [showModal, setShowModal] = useState(false);

    if (!post) return null;

    return (
        <>
            {/* Blog Card */}
            <div className="blog-card" onClick={() => setShowModal(true)}>
                <div className="blog-image">
                    {post.image && (
                        <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} />
                    )}
                </div>
                <div className="blog-info">
                    <h2>{post.title || 'Untitled'}</h2>
                    <p className="blog-meta">
                        <span className="author">{post.author?.username || 'Anonymous'}</span>
                        <time>{post.createdAt ? formatISO9075(new Date(post.createdAt)) : 'No date'}</time>
                    </p>
                    <p className="blog-summary">{post.summary || post.content || 'No content'}</p>
                </div>
            </div>

            {/* Modal for Full Post */}
            {showModal && (
                <div className="blog-modal" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                        <h2>{post.title}</h2>
                        <p>
                            <strong>{post.author?.username || 'Anonymous'}</strong> |{" "}
                            <time>{post.createdAt ? formatISO9075(new Date(post.createdAt)) : 'No date'}</time>
                        </p>
                        {post.image && (
                            <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} className="modal-image" />
                        )}
                        <p>{post.content}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Blogs;

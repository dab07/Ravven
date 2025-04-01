import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { Post, Comment } from "../type/Post";
import "../css/Blogpost.css";

export const Blogpost = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const post: Post | undefined = location.state?.post;
    const [comments, setComments] = useState<Comment[]>(post?.comments ?? []);
    const [newComment, setNewComment] = useState("");

    if (!post) {
        return <div>Post not found</div>;
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:3000/posts/${post._id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment, username: "Anonymous" }),
            });

            if (response.ok) {
                const addedComment = await response.json();
                setComments([...comments, addedComment]);
                setNewComment("");
            } else {
                console.error(`Failed to add comment for post ${post._id}`);
            }
        } catch (error) {
            console.error(`Error creating comment: ${error}`);
        }
    };

    return (
        <div className="blog-post-container">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>

            <div className="blog-post-grid">
                <div className="blog-post-image">
                    {post.image && <img src={`http://localhost:3000/uploads/${post.image}`} alt={post.title} />}
                </div>

                <div className="blog-post-title">
                    <h2 className="title">{post.title || "Untitled"}</h2>
                </div>

                <div className="blog-post-meta">
                    <p>
                        <span className="author">{post.author?.username || "Anonymous"}</span>
                        <time className="date">{post.createdAt ? formatISO9075(new Date(post.createdAt)) : "No date"}</time>
                    </p>
                    <p className="blog-summary">{post.summary || "No summary"}</p>
                </div>

                <div className="blog-post-content">
                    <p>{post.content}</p>
                </div>

                {/* New Comment Input Box */}
                <div className="blog-post-comments">
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>

                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <p>{comment.content}</p>
                                <small>
                                    {comment.author?.username || "Anonymous"} - {formatISO9075(new Date(comment.createdAt))}
                                </small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogpost;

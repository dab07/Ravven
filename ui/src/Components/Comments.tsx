import React, {useState} from "react";
import {formatISO9075} from "date-fns";
import '../type/Post'
import {Comment} from "../type/Post";
type CommentSectionProps = {
    postId: string;
    initialComments?: Comment[];
    onCommentAdded?: (comment: Comment) => void;
}

const Comments = ({postId, initialComments = [], onCommentAdded} : CommentSectionProps) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleComments = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newComment,
                    username: 'Anonymous'
                })
            });
            const data = await response.json();

            if (response.ok) {
                const addedComment = data;

                setComments([...comments, addedComment]);
                setNewComment('');

                if (onCommentAdded) {
                    onCommentAdded(addedComment);
                }
            } else {
                console.log(`Failed to fetch comments${postId}`);
            }
        } catch (e) {
            console.log(`Error creating comment: ${e}`);
        }
    }

    return (
        <div className="comment-section">
            <button onClick={() => setShowComments(!showComments)}>
                💬 Comments ({comments.length})
            </button>

            {showComments && (
                <div className="comments-container">
                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment">
                                <p>{comment.content}</p>
                                <small>
                                    {comment.author?.username || 'Anonymous'}
                                    {' - '}
                                    {formatISO9075(new Date(comment.createdAt))}
                                </small>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleComments}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Comments;

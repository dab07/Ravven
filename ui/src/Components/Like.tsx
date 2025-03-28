import React, {useState} from 'react'

type LikeButtonProps = {
    postId: string;
    initialLikes?: number;
    onLikeSuccess?: (newLikeCount: number) => void;
}

const Like = ({postId, initialLikes, onLikeSuccess} : LikeButtonProps) => {
    const [like, setLike] = useState(initialLikes);
    const [islike, setIslike] = useState(false);

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();

            if (response.ok) {
                const newLikeCount = data.likes;
                setIslike(true);
                setLike(newLikeCount);

                if (onLikeSuccess) {
                    onLikeSuccess(newLikeCount);
                }

            } else {
                console.log("Unable to fetch Likes")
            }
        } catch (e) {
            console.error('Error liking post', e);
        }
    }
    return (
        <button
            onClick={handleLike}
            disabled={islike}
            className={`like-button ${islike ? 'liked' : ''}`}
        >
            {islike ? '❤️' : '🤍'} {like} Likes
        </button>
    )

}

export default Like;

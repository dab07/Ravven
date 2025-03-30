import { Request, Response } from "express";
import PostModel from '../models/Post';

const createPost = async (req: Request, res: Response) => {
    try {
        const { title, summary, content } = req.body;
        const file = req.file;
        const userId = (req as any).userId;  // This comes from authenticateToken middleware

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        console.log("Creating post with userId:", userId);  // Debug log

        const newPost = await PostModel.create({
            title,
            summary,
            content,
            image: file ? file.filename : '',
            author: userId
        });

        res.json(newPost);
    } catch (error) {
        console.error("Detailed error in createPost:", error);
        res.status(500).json({
            error: "Internal server error",
        });
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find()
            .populate('author', ['username']) // Make sure this is working
            .sort({ createdAt: -1 })
            .limit(20);

        console.log("Sending posts:", posts); // Debug log
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const likePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        // Find the post and increment likes
        const post = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}
const unLikePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        // Find the post and increment likes
        const post = await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { likes: -1 } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ likes: post.likes });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

const commentPost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const { content, username = 'Anonymous' } = req.body;

        // Find the post and add comment
        const post = await PostModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        content,
                        author: null,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Type assertion to ensure comments exist
        const newComment = (post.comments as NonNullable<typeof post.comments>)[
        (post.comments as NonNullable<typeof post.comments>).length - 1
            ];

        res.status(201).json({
            _id: newComment._id,
            content: newComment.content,
            author: { username },
            createdAt: newComment.createdAt
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : error
        });
    }
}


module.exports = {createPost, getPosts, likePost, unLikePost,commentPost}

import { Request, Response } from "express";
import PostModel from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
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

export const getPosts = async (req: Request, res: Response) => {
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

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { title, summary, content } = req.body;
        const userId = (req as any).user._id;

        // Find and update the post
        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId, author: userId },
            { title, summary, content },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error('Post update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = (req as any).user._id;

        // Find and delete the post
        const deletedPost = await PostModel.findOneAndDelete({
            _id: postId,
            author: userId
        });

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Post delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

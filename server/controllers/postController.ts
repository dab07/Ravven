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
            author: userId  // Now this should be properly set
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

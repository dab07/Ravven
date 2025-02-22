import { Request, Response } from "express";
import PostModel from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, summary, content } = req.body;
        const file = req.file;

        console.log("Req Body ", req.body)
        console.log("Req File ", req.file)
        const newPost = await PostModel.create({
            title,
            summary,
            content,
            image: file ? file.filename : ''
        });

        res.json(newPost);
    } catch (error) {
        console.error("Detailed error in createPost:", error);
        res.status(500).json({
            error: "Internal server error",
            // message: error.message,
            // stack: error.stack
        });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

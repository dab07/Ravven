import {Request, Response} from "express";

const createPost = async (req : Request, res : Response) => {
    try {
        const {title, summary, content} = req.body;
        const file = req.file

        const post = {
            title,
            summary,
            content,
            file: file ? file.filename : null
        };

        res.json({ post });
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({error : "Internal server error"})
    }
}

module.exports = {createPost}

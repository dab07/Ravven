import {Request, Response} from "express";

const createPost = async (req : Request, res : Response) => {
    try {
        const {title, summary, file, value} = req.body;
        res.json({
            post : {title, summary, file, value}
        });
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({error : "Internal server error"})
    }
}

module.exports = {createPost}

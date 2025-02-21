import mongoose, { Document, Schema } from "mongoose";

type PostDocument = {
    title: string;
    summary: string;
    content: string;
    image?: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
} & Document

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
}, {
    timestamps: true
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;

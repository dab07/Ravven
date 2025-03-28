import mongoose, { Document, Schema } from "mongoose";

// Define a separate type for comments
type CommentDocument = {
    _id?: string;
    content: string;
    author: mongoose.Types.ObjectId | null;
    createdAt: Date;
}

// Updated PostDocument type
type PostDocument = Document & {
    title: string;
    summary: string;
    content: string;
    image?: string;
    author: mongoose.Types.ObjectId;
    likes?: number;
    comments?: CommentDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostSchema = new Schema<PostDocument>({
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [CommentSchema]
}, {
    timestamps: true
});

const PostModel = mongoose.model<PostDocument>('Post', PostSchema);

export default PostModel;

import mongoose, { Schema, Document, Model } from 'mongoose';

type UserDocument = {
    username: string;
    password: string;
} & Document

const UserSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User: Model<UserDocument> = mongoose.model('User', UserSchema);

export default User;

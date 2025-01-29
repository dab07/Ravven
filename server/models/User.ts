import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 5, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

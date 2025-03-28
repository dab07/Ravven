import { Request, Response } from "express";
import User from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import PostModel from "../models/Post";

const SALT_ROUNDS : number = 10;
const JWT_SECRET : string = 'かいずこ鬼俺わなる'

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
            };
            userId?: string;
        }
    }
}

const login = async (req : Request, res : Response) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });

        const user = await User.findOne({ username }, null, null)
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, (user as any).password);
        if (!isPasswordValid) {
            console.log('Password mismatch');
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            {userId: (user as any)._id, username : (user as any).username},
            JWT_SECRET,
            {expiresIn: '24h'}
        )
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000
        });

        console.log("Login successful");
        res.status(200).json({
            message: "Login successful",
            user: { username: (user as any).username, _id: (user as any)._id },
            token : token
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const signup = async (req: Request, res: Response) => {
    try {
        console.log('Signup attempt');
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            username,
            password: hashedPassword
        });
        const userDoc = await newUser.save();
        res.status(201).json({
            user: { username: userDoc.username, _id: userDoc._id }
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        console.log('User logged out successfully');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ error: 'Error during logout' });
    }
};

const profile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await User.findById(userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error in profile controller:", error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

export const authenticateToken = (req: Request, res: Response, next: Function) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, username: string };
        req.userId = decoded.userId;
        req.user = {
            userId: decoded.userId,
            username: decoded.username
        };
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

const verifyToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

const updateProfile = async (req : Request, res : Response) => {
    const { username, password } = req.body;
    const userId = (req as any).userId; // Assuming session middleware is used

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username) user.username = username;
        if (password) user.password = await bcrypt.hash(password, 10); // Secure password update

        await user.save();
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }

};

module.exports = {login, signup, logout, profile, authenticateToken, verifyToken, updateProfile}

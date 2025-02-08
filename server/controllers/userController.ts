import { Request, Response } from "express";
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS : number = 10;
const JWT_SECRET : string = 'かいずこ鬼俺わなる'
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

        const token = jwt.sign({userId: (user as any)._id, username : (user as any).username},
            JWT_SECRET,
            {expiresIn: '24h'}
        )
        console.log("Login successful");
        res.status(200).cookie('token', token).json({
            message: "Login successful",
            user: { username: (user as any).username, _id: (user as any)._id },
            token
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
const authenticateToken = (req: Request, res: Response, next: Function) => {
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, username: string };
        (req as any).userId = decoded.userId; // Attach userId to request
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
// const authenticateToken = (req: Request, res: Response, next: Function) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//
//     if (!token) {
//         return res.status(401).json({ error: "Access token required" });
//     }
//
//     jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//         if (err) {
//             return res.status(403).json({ error: "Invalid or expired token" });
//         }
//         (req as any).user = user;
//         next();
//     });
// };


const verifyToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = {login, signup, profile, authenticateToken, verifyToken}

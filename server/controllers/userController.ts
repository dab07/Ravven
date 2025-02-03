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

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Password mismatch');
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({userId: user._id, username : user.username},
            JWT_SECRET,
            {expiresIn: '1h'}
        )
        console.log("Login successful");
        res.status(200).cookie('token', token).json({
            message: "Login successful",
            user: { username: user.username, _id: user._id },
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
const authenticateToken = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        (req as any).user = user;
        next();
    });
};

const verifyToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user; // Set by authenticateToken middleware
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = {login, signup, authenticateToken, verifyToken}

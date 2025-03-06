import { Request, Response } from "express";
import User from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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

const verifyToken = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
/* *
• authenticateToken vs. checkAuth

authenticateToken: This is a middleware function designed to protect routes. It verifies a token exists and is valid,
    then attaches user info to the request object before calling next() to proceed to the protected route handler.
checkAuth: This is an endpoint handler specifically for checking authentication status and returning that information to the client.
    It doesn't just verify the token - it returns a response about authentication status and user data.

Why you need checkAuth
    The key difference is in how they're used:
        Different use cases:
            authenticateToken is used to protect API routes (like /profile)
            checkAuth is used as an API endpoint itself that the frontend can call to determine auth status

        Different responses:
            authenticateToken doesn't return a response by itself - it either lets the request continue or returns an error
            checkAuth always returns a response with information about authentication status

        Frontend initialization:
            When your React app first loads, it needs to know if the user is already authenticated
            The app can't just try to access a protected route - it needs a dedicated endpoint that specifically answers "is the user logged in?"
/
 */
const checkAuth = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token || (req.headers.authorization?.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ authenticated: false });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, username: string };
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return res.status(404).json({ authenticated: false });
            }

            return res.status(200).json({
                authenticated: true,
                user: { username: user.username, _id: user._id }
            });
        } catch (err) {
            return res.status(403).json({ authenticated: false });
        }
    } catch (error) {
        console.error("Error in checkAuth controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {login, signup, logout, profile, authenticateToken, verifyToken, checkAuth}

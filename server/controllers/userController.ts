import { Request, Response } from "express";
import User from '../models/User'

// Add console logs to debug
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });

        const user = await User.findOne({ username });
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Compare raw password against stored password
        if (user.password !== password) {
            console.log('Password mismatch:', {
                provided: password,
                stored: user.password
            });
            return res.status(401).json({ error: "Invalid password" });
        }
        console.log("User ki balle balle")
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        console.log('Signup Request Body:', req.body);
        const { username, password } = req.body;
        const UserDoc = await User.create({username, password});
        res.status(201).json({ UserDoc });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

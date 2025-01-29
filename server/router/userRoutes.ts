import express, { Request, Response } from 'express';
import { login, signup } from '../controllers/userController';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    await login(req, res);
});

router.post('/signup', async (req: Request, res: Response) => {
    await signup(req, res);
});

export default router;

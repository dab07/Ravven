import { Request, Response } from 'express';
import express = require('express');
import { ParamsDictionary } from 'express-serve-static-core';
const controllers = require('../controllers/userController');

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    await controllers.login(req, res);
});

router.post('/signup', async (req: Request, res: Response) => {
    await controllers.signup(req, res);
});
router.get('/profile', async (req : Request, res : Response)=> {
    res.json(req.cookies)
})
router.get('/protected-route',
    controllers.authenticateToken,
    (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
        res.json({ message: "Protected data", user: (req as any).user });
    }
);

router.get('/verifyToken',
    controllers.authenticateToken,
    controllers.verifyToken
);



export default router;

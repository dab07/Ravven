import { Request, Response } from 'express';
import express = require('express');
import { ParamsDictionary } from 'express-serve-static-core';
const controllers = require('../controllers/userController');

const router = express.Router();

router.post('/login', controllers.login);
router.post('/signup', controllers.signup);

router.get('/profile', controllers.authenticateToken, controllers.profile);

router.get('/verifyToken', controllers.authenticateToken, controllers.verifyToken);


// router.post('/login', async (req: Request, res: Response) => {
//     await controllers.login(req, res);
// });
//
// router.post('/signup', async (req: Request, res: Response) => {
//     await controllers.signup(req, res);
// });
// router.get('/profile', async (req : Request, res : Response)=> {
//     await controllers.profile(req, res);
// })
//
// router.get('/verifyToken',
//     controllers.authenticateToken,
//     controllers.verifyToken
// );



export default router;

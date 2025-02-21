import express = require('express');

import {middleware} from "../middleware/middleware";
const usercontrollers = require('../controllers/userController');
const postcontrollers = require('../controllers/postController');

const router = express.Router();

router.post('/login', usercontrollers.login);
router.post('/signup', usercontrollers.signup);
router.post('/logout', usercontrollers.logout);
router.post('/createpost', middleware.single('file'), postcontrollers.createPost);
router.get('/getpost', postcontrollers.getPosts);

router.get('/profile', usercontrollers.authenticateToken, usercontrollers.profile);
router.get('/verifyToken', usercontrollers.authenticateToken, usercontrollers.verifyToken);

export default router;

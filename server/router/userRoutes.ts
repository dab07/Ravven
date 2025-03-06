import express = require('express');

import {middleware, logRequest} from "../middleware/middleware";
const usercontrollers = require('../controllers/userController');
const postcontrollers = require('../controllers/postController');

const router = express.Router();

router.post('/login', usercontrollers.login);
router.post('/signup', usercontrollers.signup);
router.post('/logout', usercontrollers.logout);
router.post('/createpost', usercontrollers.authenticateToken, logRequest, middleware.single('file'), postcontrollers.createPost);
router.get('/getpost', postcontrollers.getPosts);
// In your routes file
router.get('/check-auth', usercontrollers.checkAuth);
router.get('/profile', usercontrollers.authenticateToken, usercontrollers.profile);
router.get('/verifyToken', usercontrollers.authenticateToken, usercontrollers.verifyToken);

export default router;

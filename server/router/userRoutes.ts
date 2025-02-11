import express = require('express');

const usercontrollers = require('../controllers/userController');
const postcontrollers = require('../controllers/postController');

const router = express.Router();

router.post('/login', usercontrollers.login);
router.post('/signup', usercontrollers.signup);
router.post('/logout', usercontrollers.logout);
router.post('/createpost', postcontrollers.createPost);
router.get('/profile', usercontrollers.authenticateToken, usercontrollers.profile);
router.get('/verifyToken', usercontrollers.authenticateToken, usercontrollers.verifyToken);

export default router;

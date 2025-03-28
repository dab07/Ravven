import express = require('express');

const postcontrollers = require('../controllers/postController');

const router = express.Router();

router.post('/:id/like', postcontrollers.likePost);
router.post('/:id/comments', postcontrollers.commentPost);

export default router;

const express = require('express');
const { verifyToken } = require('../middlewares/token');
const chatController = require('../controllers/chat.controllers');
const router = express.Router();

router.post('/create-chat', verifyToken, chatController.createChat);
router.get('/messages/:userId', verifyToken, chatController.getChat);

module.exports = router;

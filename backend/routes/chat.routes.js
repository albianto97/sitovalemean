const express = require('express');
const { verifyToken, verifyAdminToken} = require('../middlewares/token');
const chatController = require('../controllers/chat.controllers');
const notificationController = require("../controllers/notify.controller");
const router = express.Router();

router.post('/create-chat', verifyToken, chatController.createChat);
router.get('/messages/:userId', verifyToken, chatController.getChatForUser);
router.get('/usersOpen', verifyToken, chatController.getChatUserOpen);
router.delete('/messages/:userId', verifyAdminToken, chatController.deleteChat);

module.exports = router;

const express = require('express');
const { verifyToken } = require('../middlewares/token');
const chatController = require('../controllers/chat.controllers');
const router = express.Router();

// Rotta per creare un nuovo messaggio
router.post('/create-chat', verifyToken, chatController.createChat);

module.exports = router;

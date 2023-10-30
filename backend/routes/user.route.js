const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Rotta per ottenere tutti gli utenti
router.get('/', userController.getUser);
router.post('/create-user', userController.createUser);

module.exports = router;

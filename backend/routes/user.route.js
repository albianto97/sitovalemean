const userController = require('../controllers/user.controller');
const express = require('express');
const authMiddleware = require("../../frontend/src/app/auth/auth.middleware");
const router = express.Router();

// Middleware per l'autenticazione
// Rotta per ottenere tutti gli utenti
router.get('/', userController.getUser);
// Rotta per ottenere singolo utenti
router.get('/:userId', userController.getSingleUser);
// Rotta per creare un utente
router.post('/create-user', userController.createUser);
// Rotta per effettuare il Login di un utente
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;

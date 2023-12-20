const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Rotta per ottenere tutti gli utenti
router.get('/', userController.getUser);
// Rotta per ottenere singolo utenti
router.get('/:userId', userController.getSingleUser);
// Rotta per creare un utente
router.post('/create-user', userController.createUser);
// Rotta per effettuare il Login di un utente
router.post('/login', userController.login);

module.exports = router;

const userController = require('../controllers/user.controller');
const express = require('express');
const {verifyAdminToken} = require("../middlewares/token");
const router = express.Router();

// Rotta per ottenere tutti gli utenti
router.get('/', verifyAdminToken, userController.getUser);
router.get('/searchUsersByUsername',verifyAdminToken, userController.searchUsersByUsername);
// Rotta per ottenere singolo utenti
router.get('/:userId',verifyAdminToken, userController.getSingleUser);
// Rotta per creare un utente
router.post('/create-user', userController.createUser);
// Rotta per effettuare il Login di un utente
router.post('/login', userController.login);
router.post('/addAdmin', userController.addAdmin);





module.exports = router;

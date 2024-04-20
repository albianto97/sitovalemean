const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notify.controller');
const {verifyToken} = require("../middlewares/token");

// Endpoint per la creazione di una nuova notifica
router.post('/createNotify',verifyToken, notificationController.createNotification);

module.exports = router;

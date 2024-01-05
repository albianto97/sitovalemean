const orderController = require('../controllers/order.controller');
const express = require('express');
const { verifyToken } = require('../middlewares/token');
const router = express.Router();

// Rotta per creare un ordine
router.post('/create-order', orderController.createOrder);
// Rotta protetta per prendere gli ordini di un utente loggato
router.get('/getOrdersFromUser', verifyToken, orderController.getOrderOfUser);

module.exports = router;

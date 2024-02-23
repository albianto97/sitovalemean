const orderController = require('../controllers/order.controller');
const express = require('express');
const { verifyToken } = require('../middlewares/token');
const userController = require("../controllers/user.controller");
const router = express.Router();

// Rotta per creare un ordine
router.post('/create-order', orderController.createOrder);
// Rotta per ottenere tutti ordini
router.get('/getAllOrders', orderController.getAllOrders);
// Rotta protetta per prendere i prodotti di un utente loggato piu ordinati
router.get('/getOrderOfUserProduct', verifyToken, orderController.getOrderOfUserProduct);
// Rotta protetta per prendere gli ordini di un utente loggato
router.get('/getOrdersFromUser', verifyToken, orderController.getOrdersFromUser);

router.get('/searchOrdersByUsername', orderController.searchOrdersByUsername);

module.exports = router;

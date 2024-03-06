const orderController = require('../controllers/order.controller');
const express = require('express');
const { verifyToken, verifyAdminToken} = require('../middlewares/token');
const router = express.Router();

// Rotta per creare un ordine
router.post('/create-order', verifyToken, orderController.createOrder);
// Rotta per ottenere tutti ordini
router.get('/getAllOrders', verifyAdminToken, orderController.getAllOrders);
// Rotta protetta per prendere i prodotti di un utente loggato piu ordinati
router.get('/getOrderOfUserProduct', verifyToken, orderController.getOrderOfUserProduct);
// Rotta protetta per prendere gli ordini di un utente loggato
router.get('/getOrdersFromUser', verifyToken, orderController.getOrdersFromUser);

router.get('/searchOrdersByUsername',verifyAdminToken, orderController.searchOrdersByUsername);

router.get('/:orderId', verifyAdminToken, orderController.getOrder);

module.exports = router;

const orderController = require('../controllers/order.controller');
const express = require('express');
const router = express.Router();

// Rotta per creare un ordine
router.post('/create-order', orderController.createOrder);

module.exports = router;

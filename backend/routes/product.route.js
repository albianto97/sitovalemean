const productController = require('../controllers/product.controller');
const express = require('express');
const router = express.Router();

// Rotta per ottenere tutti i prodotti
router.get('/', productController.getProduct);
// Rotta per ottenere singolo prodotto
router.get('/:userId', productController.getSingleProduct);
// Rotta per creare un prodotto
router.post('/create-user', productController.createProduct);

module.exports = router;

const productController = require('../controllers/product.controller');
const express = require('express');
const { verifyToken } = require('../middlewares/token');
const router = express.Router();

// Rotta per ottenere tutti i prodotti
router.get('/', productController.getProduct);
// Rotta per ottenere singolo prodotto
router.get('/:productId', productController.getSingleProduct);
// Rotta per creare un prodotto
router.post('/create-product', productController.createProduct);
// Rotta per ottenere una lista dei prodotti dall'id
router.post('/getProductsById', productController.getProductsById);
//Rotte per incrementare la disponibilita prodotto
router.put('/:productId/increment', productController.incrementProductQuantity);
router.put('/:productId/decrement', productController.decrementProductQuantity);
router.put('/:productId/zero', productController.quantity0);

module.exports = router;

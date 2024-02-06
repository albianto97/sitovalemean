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
//Rotta per i migliori prodotti
router.get('/pp', verifyToken,productController.pippo);


module.exports = router;

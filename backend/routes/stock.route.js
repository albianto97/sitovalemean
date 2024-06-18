const stockController = require('../controllers/stock.controller');
const express = require('express');
const { verifyToken, verifyAdminToken } = require('../middlewares/token');
const router = express.Router();

// Rotta per ottenere tutti i movimenti di magazzino
router.get('/getStockMovements', verifyAdminToken, stockController.getStockMovements);

// Rotta per restituire i movimenti raggruppati per giorni
router.get('/getStockExpensesGroupedByDate', verifyAdminToken, stockController.getStockExpensesGroupedByDate);

// Rotta per inserire movimenti di magazzino
router.post('/insertStockMovements', verifyAdminToken, stockController.insertStockMovement);



module.exports = router;

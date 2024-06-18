const rawIngredients = require('../controllers/rawIngredents.controller');
const express = require('express');
const { verifyToken, verifyAdminToken} = require('../middlewares/token');
const router = express.Router();

// Rotta per ottenere tutti gli ingredienti
router.get('/getIngredients', verifyAdminToken, rawIngredients.getIngredients);
// Rotta per inserire un ingrediente
router.post('/insertIngredient', verifyAdminToken, rawIngredients.insertNewIngredient);

// Rotta per eliminare un ingrediente
router.delete('/deleteIngredient', verifyAdminToken, rawIngredients.deleteIngredient);


module.exports = router;

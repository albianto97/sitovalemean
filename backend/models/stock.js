const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  movementQuantity: { type: Number, required: true },
  typeMovement: { type: String, enum: ['load', 'unload'], required: true },
  price: { type: Number, required: true },
  insertDate: { type: Date, required: true }
});

const Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;

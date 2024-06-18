const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rawIngredientsSchema = new Schema({
  name: { type: String, required: true },
  disponibilty: { type: Number, required: true },
  meauserement: {
    type: String,
    required: true,
    enum: ['Kg', 'Pz', 'L'] // Definisci i tipi di misurazione consentiti
  },
  mediumPrice: { type: Number, required: true }
});

// Indice unico per il campo 'name'
rawIngredientsSchema.index({ name: 1 }, { unique: true });

const Ingredient = mongoose.model('Ingredient', rawIngredientsSchema);

module.exports =  Ingredient;

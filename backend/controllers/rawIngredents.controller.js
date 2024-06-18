
const Ingredient = require("../models/rawIngredients");
const Stock = require("../models/stock");
// Route per creare un nuovo Ingrediente
const insertNewIngredient = async (req, res) => {
  console.log('Richiesta per inserire un nuovo ingrediente ricevuta.');

  const newIngredient = new Ingredient(req.body);
  const name = newIngredient.name;

  try {
    // Verifica se esiste già un ingrediente con lo stesso nome
    const existingIngredient = await Ingredient.findOne({ name });
    if (existingIngredient) {
      return res.status(400).send('Esiste già un ingrediente con questo nome.');
    }

    // Salva il nuovo ingrediente nel database
    await newIngredient.save();

    res.status(201).send(newIngredient);
  } catch (error) {
    console.error('Errore durante l\'inserimento dell\'ingrediente:', error);
    res.status(500).send('Errore interno del server durante l\'inserimento dell\'ingrediente.');
  }
};

// Route per ottenere tutti gli ingredienti
const getIngredients = async (req, res) => {
  console.log('Richiesta per ottenere tutti gli ingredienti ricevuta.');

  try {
    // Esegui la query per trovare tutti gli ingredienti
    const ingredients = await Ingredient.find();

    // Se non ci sono ingredienti trovati, restituisci un messaggio di vuoto
    if (!ingredients || ingredients.length === 0) {
      return res.status(404).send('Nessun ingrediente trovato.');
    }

    // Se gli ingredienti sono stati trovati, invia la risposta con il codice di stato 200
    res.status(200).send(ingredients);
  } catch (error) {
    // Se si verifica un errore durante il recupero degli ingredienti, gestiscilo qui
    console.error('Errore nel recupero degli ingredienti:', error);
    res.status(500).send('Errore interno del server durante il recupero degli ingredienti.');
  }
};
// per eliminare un ingrediente
const deleteIngredient = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se ci sono movimenti associati all'ingrediente
    const existingMovements = await Stock.find({ ingredientId: id });

    if (existingMovements.length > 0) {
      return res.status(400).send('Impossibile eliminare l\'ingrediente perché ci sono movimenti associati.');
    }

    // Se non ci sono movimenti associati, procedi con l'eliminazione dell'ingrediente
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);
    
    if (!deletedIngredient) {
      return res.status(404).send('Ingrediente non trovato.');
    }
    
    res.status(200).send('Ingrediente eliminato con successo.');
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'ingrediente:', error);
    res.status(500).send('Errore interno del server durante l\'eliminazione dell\'ingrediente.');
  }
};


module.exports = {
  insertNewIngredient,
  getIngredients,
  deleteIngredient
}

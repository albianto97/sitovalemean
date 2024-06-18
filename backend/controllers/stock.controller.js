const Stock = require("../models/stock");
const Ingredient = require("../models/rawIngredients");

// Route per creare un nuovo movimento
const insertStockMovement = async (req, res) => {
    try {
      const { ingredientId, movementQuantity, typeMovement, price, insertDate } = req.body;
      
      // Crea il nuovo movimento (Stock)
      const nuovoMovimento = new Stock({ ingredientId, movementQuantity, typeMovement, price, insertDate });
        await nuovoMovimento.save();

        // Aggiorna la disponibilità dell'ingrediente
        const ingredienteAggiornato = await Ingredient.findById(ingredientId);
        if (typeMovement === 'load') {
            ingredienteAggiornato.disponibilty += movementQuantity;
        } else if (typeMovement === 'unload') {
            ingredienteAggiornato.disponibilty -= movementQuantity;
        }
        await ingredienteAggiornato.save();

        res.status(201).send(nuovoMovimento);
    } catch (error) {
        res.status(400).send(error);
    }
}

// Route per ottenere movimenti in un intervallo di date
const getStockMovements = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
      // Controlla se le date sono valide
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).send({ message: 'Date non valide' });
      }

      filter.insertDate = {
        $gte: start,
        $lte: end
      };
    }

    //const movimenti = await Stock.find(filter).populate('ingredientId');
    const movimenti = await Stock.find(filter);

    res.status(200).send(movimenti);
  } catch (error) {
    console.error('Errore durante il recupero dei movimenti di stock:', error);
    res.status(400).send(error);
  }
};


// Funzione per generare una sequenza di date
const generateDateRange = (start, end) => {
  const dates = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const getStockExpensesGroupedByDate = async (req, res) => {
const { startDate, endDate } = req.query;

let start, end;
if (startDate && endDate) {
  start = new Date(startDate);
  end = new Date(endDate);
} else {
  // Recupera la data del primo movimento di stock
  const firstStock = await Stock.findOne().sort({ insertDate: 1 });
  start = firstStock ? firstStock.insertDate : new Date();
  end = new Date();
}

try {
  const result = await Stock.aggregate([
    {
      $match: {
        insertDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$insertDate" }
        },
        totalExpenses: { $sum: "$price" }
      }
    },
    {
      $sort: { "_id": 1 }  // Ordina per data
    }
  ]);

  // Converte il risultato dell'aggregazione in un oggetto con date come chiavi
  const expensesByDate = {};
  result.forEach(day => {
    expensesByDate[day._id] = day.totalExpenses;
  });

  // Genera tutte le date nell'intervallo
  const dateRange = generateDateRange(start, end);

  // Crea il risultato finale, riempiendo le date mancanti con 0
  const groupedExpenses = dateRange.map(date => {
    const dateString = date.toISOString().split('T')[0];
    return {
      date: dateString,
      totalExpenses: expensesByDate[dateString] || 0
    };
  });

  res.json(groupedExpenses);
} catch (err) {
  console.error(err);
  res.status(500).send('Server Error');
}
};

module.exports = {
    getStockMovements,
    insertStockMovement,
    getStockExpensesGroupedByDate
}

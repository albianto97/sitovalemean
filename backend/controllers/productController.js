import { Product } from '../models/productModel.js';

export const getProduct = async (req, res) => {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.json(prod);

// ✅ Lista prodotti
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find();

    // Se è loggato come utente "normale", mostra quantità rimanente
    if (req.user && req.user.role === 'user') {
      const reservations = await Reservation.find();

      const updated = products.map((p) => {
        const totalReserved = reservations.reduce((count, r) => {
          const item = r.products.find(
            (pr) => pr.productId.toString() === p._id.toString()
          );
          return count + (item ? item.quantity : 0);
        }, 0);

        return {
          ...p.toObject(),
          quantity: Math.max(0, p.quantity - totalReserved)
        };
      });

      return res.json(updated);
    }

    // Se è admin o utente non loggato → restituisci quantità reale
    res.json(products);
  } catch (error) {
    console.error('Errore getProducts:', error);
    res.status(500).json({ message: 'Errore nel recupero prodotti' });
  }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, quantity, link } = req.body;
        const product = await Product.create({ name, description, quantity, link });
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Errore creazione prodotto', error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Prodotto non trovato' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Errore aggiornamento prodotto', error: err.message });
    }
};

export const deleteProduct = async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.json({ message: 'Prodotto eliminato' });
};

// PATCH /:id/quantity {quantity: number}
export const updateQuantity = async (req, res) => {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Quantità non valida' });
    }
    const prod = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { quantity } },
        { new: true }
    );
    if (!prod) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.json(prod);
};

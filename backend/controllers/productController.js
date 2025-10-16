import { Product } from '../models/productModel.js';

export const getProduct = async (req, res) => {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({message: 'Prodotto non trovato'});
    res.json(prod);
}
// ✅ Lista prodotti
export const listProduct = async (req, res) => {
    try {
        const products = await Product.find();

        if (req.user && req.user.role === 'user') {
            // 👤 L'utente vede solo la quantità rimanente (disponibile)
            const visible = products.map((p) => ({
                ...p.toObject(),
                quantity: Math.max(0, p.stock - p.reserved) // quantità disponibile
            }));
            return res.json(visible);
        }

        // 🧑‍💼 L’admin vede la quantità totale
        const visible = products.map((p) => ({
            ...p.toObject(),
            quantity: p.stock, // mostra quantità totale
            reserved: p.reserved // opzionale: mostra anche prenotati
        }));
        return res.json(visible);
    } catch (error) {
        console.error('Errore getProducts:', error);
        res.status(500).json({ message: 'Errore nel recupero prodotti' });
    }
};


export const createProduct = async (req, res) => {
    try {
        const { name, description, stock , link } = req.body;
        const product = await Product.create({ name, description, stock, reserved: 0, link });
        res.status(201).json(product);
    } catch (err) {
        console.error('Errore creazione prodotto:', err);
        res.status(400).json({
            message: 'Errore creazione prodotto',
            error: err.message,
            details: err.errors || null
        });
        //res.status(400).json({ message: 'Errore creazione prodotto', error: err.message });
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

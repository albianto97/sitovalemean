import mongoose from 'mongoose';
import { Product } from '../models/productModel.js';
import { Reservation } from '../models/reservationModel.js';

/**
 * Ritorna la prenotazione dell'utente loggato
 */
export const getMyReservations = async (req, res) => {
    const r = await Reservation.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(r || { userId: req.user.id, products: [] });
};

/**
 * Aggiunge 1 unità del prodotto alla prenotazione dell'utente
 * Decrementa quantità prodotto se disponibile
 */
export const addProduct = async (req, res) => {
    const { productId } = req.params;

    // Decremento atomico se quantity > 0
    const updated = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } },
        { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Prodotto esaurito o inesistente' });

    // Upsert prenotazione
    const reservation = await Reservation.findOneAndUpdate(
        { userId: req.user.id, 'products.productId': { $ne: productId } },
        { $push: { products: { productId: new mongoose.Types.ObjectId(productId), quantity: 1 } } },
        { new: true }
    );

    if (!reservation) {
        // Se esiste già l'item, incrementa quantity
        const incRes = await Reservation.findOneAndUpdate(
            { userId: req.user.id, 'products.productId': productId },
            { $inc: { 'products.$.quantity': 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(await incRes.populate('products.productId'));
    }

    res.json(await reservation.populate('products.productId'));
};

/**
 * Rimuove 1 unità del prodotto dalla prenotazione (o interamente se quantity va a 0)
 * Incrementa quantità prodotto
 */
export const removeProduct = async (req, res) => {
    const { productId } = req.params;

    // Trova prenotazione
    const reservation = await Reservation.findOne({ userId: req.user.id });
    if (!reservation) return res.status(404).json({ message: 'Prenotazione non trovata' });

    const item = reservation.products.find(p => String(p.productId) === String(productId));
    if (!item) return res.status(404).json({ message: 'Prodotto non presente in prenotazione' });

    // Incrementa stock
    await Product.findByIdAndUpdate(productId, { $inc: { quantity: 1 } });

    // Decrementa quantità in prenotazione o rimuovi item
    if (item.quantity > 1) {
        await Reservation.updateOne(
            { userId: req.user.id, 'products.productId': productId },
            { $inc: { 'products.$.quantity': -1 } }
        );
    } else {
        await Reservation.updateOne(
            { userId: req.user.id },
            { $pull: { products: { productId: new mongoose.Types.ObjectId(productId) } } }
        );
    }

    const updated = await Reservation.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(updated || { userId: req.user.id, products: [] });
};

/**
 * Svuota la prenotazione, ripristinando le quantità dei prodotti
 */
export const clearReservations = async (req, res) => {
    const reservation = await Reservation.findOne({ userId: req.user.id });
    if (!reservation) return res.json({ message: 'Nulla da svuotare' });

    // Ripristina stock per ciascun item
    const ops = reservation.products.map(p =>
        Product.findByIdAndUpdate(p.productId, { $inc: { quantity: p.quantity } })
    );
    await Promise.all(ops);

    await Reservation.deleteOne({ userId: req.user.id });
    res.json({ message: 'Prenotazioni svuotate' });
};

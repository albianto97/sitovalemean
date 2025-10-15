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
    try {
        const userId = req.user.id;

        // prendi da params o body
        const productId = req.params.productId || req.params.id || req.body.productId;

        if (!productId) {
            return res.status(400).json({ message: 'productId mancante (params o body)' });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'productId non valido' });
        }

        // opzionale: verifica che il prodotto esista e che ci sia stock
        const prod = await Product.findById(productId);
        if (!prod) return res.status(404).json({ message: 'Prodotto non trovato' });
        if (prod.reserved <= 0) {
            return res.status(409).json({ message: 'Prodotto esaurito' });
        }

        // cerca/crea la reservation per l’utente
        let reservation = await Reservation.findOne({ userId });
        if (!reservation) {
            reservation = await Reservation.create({
                userId,
                products: [{ productId, reserved: 1 }]
            });
        } else {
            const existing = reservation.products.find(
                (p) => p.productId.toString() === productId
            );
            if (existing) {
                existing.reserved += 1;
            } else {
                reservation.products.push({ productId, reseved: 1 });
            }
            await reservation.save();
        }

        // decrementa lo stock
        await Product.findByIdAndUpdate(productId, { $inc: { reserved: -1 } }, { new: true });

        res.status(200).json({ message: 'Prodotto prenotato con successo', reservation });
    } catch (error) {
        console.error('Errore durante la prenotazione:', error);
        res.status(500).json({ message: 'Errore durante la prenotazione', error });
    }
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
    await Product.findByIdAndUpdate(productId, { $inc: { reserved: 1 } });

    // Decrementa quantità in prenotazione o rimuovi item
    if (item.reserved > 1) {
        await Reservation.updateOne(
            { userId: req.user.id, 'products.productId': productId },
            { $inc: { 'products.$.reserved': -1 } }
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
        Product.findByIdAndUpdate(p.productId, { $inc: { reserved: p.reserved } })
    );
    await Promise.all(ops);

    await Reservation.deleteOne({ userId: req.user.id });
    res.json({ message: 'Prenotazioni svuotate' });
};

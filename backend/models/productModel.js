import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
            name: { type: String, required: true, trim: true },
            description: { type: String, required: true },
            stock: { type: Number, required: true, min: 0 }, // quantità totale
            reserved: { type: Number, default: 0, min: 0 },  // quantità prenotata
            link: { type: String },
            createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

export const Product = mongoose.model('Product', productSchema);

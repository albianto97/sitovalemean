import mongoose from 'mongoose';

const reservationItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 }
    },
    { _id: false }
);

const reservationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
        products: [reservationItemSchema],
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);

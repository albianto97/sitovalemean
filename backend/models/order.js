const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    creationDate: { type: Date, required: true },
    closingDate: { type: Date, required: false },
    shippingDate: { type: Date, required: false },
    status:  {
        type: String,
        enum: ['in attesa', 'rifiutato', 'accettato', 'lavorazione', 'terminato', 'consegnato'], // Specifica un elenco di valori validi
        required: true
      },
    note:{ type: String, required: false},
    orderType:{ type: String,enum: ['domicilio', 'ritiro'], required: false},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, required: true }
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;

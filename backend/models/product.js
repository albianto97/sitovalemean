const mongoose = require('mongoose');

const ProductTypeEnum = {
    TORTA: 'TORTA',
    GELATO: 'GELATO',
};

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    disponibilita: { type: Number, default: 0 },
    link: { type: String },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;

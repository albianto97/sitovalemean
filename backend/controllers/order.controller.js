const Order = require("../models/order");
const jwt = require('jsonwebtoken');
const Product = require("../models/product");
const User = require("../models/user");

const getAllOrders = async (req, res) => {
    // Logica per ottenere ordini
    const orders = await Order.find();
    console.log(orders);
    res.json(orders);

    //res.send(res.json);
}
const getOrderOfUserProduct = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user = jwt.decode(token);

    try {
        const orders = await Order.find({ user: user._id });

        // Creare traccia della quantità di ciascun prodotto acquistato
        const productCounts = {};

        // Itera su tutti gli ordini
        orders.forEach(order => {
            // Itera su tutti i prodotti in ciascun ordine
            order.products.forEach(product => {
                const productId = product.productId.toString();

                // Aggiorna la quantità di acquisto del prodotto
                if (productCounts[productId]) {
                    productCounts[productId] += product.quantity;
                } else {
                    productCounts[productId] = product.quantity;
                }
            });
        });

        // Ordina i prodotti in base alla quantità acquistata in ordine decrescente
        const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);
        console.log(productCounts);

        // Ottieni i dettagli dei prodotti più acquistati
        const bestProductsData = await Product.find({ _id: { $in: sortedProducts } });

        // Costruisci un array di oggetti per ciascun prodotto con il conteggio
        const bestProducts = bestProductsData.map(product => {
            let p = Object.assign(product._doc,{count:productCounts[product._id]});

            return p
        });

        res.json({ bestProducts });
    } catch (err) {
        console.error('Errore nel recupero dei prodotti:', err);
        res.status(500).json({ message: 'Errore del server' });
    }
};

const getOrdersFromUser =async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user =jwt.decode(token);
    try {
        const ordini = await Order.find({ user: user._id }).sort({ creationDate: -1 });
        res.json(ordini);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.json({ msg: "Ordine creato con successo!", order: newOrder });
    } catch (e) {
        res.status(400).send(e);
    }
}


module.exports = {
    createOrder,
    getOrderOfUserProduct,
    getOrdersFromUser,
    getAllOrders
}

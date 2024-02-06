const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");


const getProduct = async (req, res) => {
    // Logica per ottenere un utente
    try{
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
    //res.send(res.json);
}

const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log('productId:', productId); // Aggiungi questo console.log per controllare il valore di productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Prodotto non trovato'});
        }

        res.json(product);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).json({message: 'Errore del server'});
    }
};

const createProduct = async (req, res) => {
    console.log(req)
    Product.create(req.body)
        .then(() => res.json({ msg: "Prodotto creato con successo!" }))
        .catch(() => res.status(400).json({ msg: "Errore nella creazione" }));

}
const pippo = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user =jwt.decode(token);
    try {
        const ordini = await Order.find({ user: user._id }).sort({ creationDate: -1 });
        res.json(ordini);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




module.exports = {
    getProduct,
    createProduct,
    getSingleProduct,
    pippo
}

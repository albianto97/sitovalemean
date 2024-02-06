const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");


const getProduct = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user =jwt.decode(token);
    const pipeline = [
        { $match: { user: mongoose.Types.ObjectId(user._id) } }, // Filtra gli ordini per utente
        { $unwind: "$products" }, // "Spiega" l'array dei prodotti
        { $group: { _id: "$products", totalOrders: { $sum: 1 } } }, // Raggruppa per prodotto e conta le occorrenze
        { $sort: { totalOrders: -1 } }, // Ordina in base al numero di ordini in ordine decrescente
        { $limit: 3 }, // Limita a 3 risultati
    ];

    const result = await Order.aggregate(pipeline);
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

module.exports = {
    getProduct,
    createProduct,
    getSingleProduct,
    pippo
}

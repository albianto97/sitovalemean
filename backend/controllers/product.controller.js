const Product = require("../models/product");
const jwt = require("jsonwebtoken");

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
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({message: 'Utente non trovato'});
        }

        res.json(product);
    } catch (error) {
        console.error('Errore durante il recupero dell\'utente:', error);
        res.status(500).json({message: 'Errore del server'});
    }
};
const createProduct = async (req, res) => {
    console.log(req)
    Product.create(req.body)
        .then(() => res.json({ msg: "Prodotto creato con successo!" }))
        .catch(() => res.status(400).json({ msg: "Errore nella creazione" }));

}
const getBestProducts = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user =jwt.decode(token);

    try {
        // Trova tutti gli ordini dell'utente
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

        // Ottieni i dettagli dei prodotti più acquistati
        const bestProducts = await Product.find({ _id: { $in: sortedProducts } });

        res.json(bestProducts);
    } catch (err) {
        console.error('Errore nel recupero dei prodotti:', error);
        res.status(500).json({ message: 'Errore del server' });
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    getProduct,
    createProduct,
    getSingleProduct,
    getBestProducts
}

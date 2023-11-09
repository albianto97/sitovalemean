const Product = require("../models/product");

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
        .then(() => res.json({ msg: "Utente creato con successo!" }))
        .catch(() => res.status(400).json({ msg: "Errore nella creazione" }));
}

module.exports = {
    getProduct,
    createProduct,
    getSingleProduct
}

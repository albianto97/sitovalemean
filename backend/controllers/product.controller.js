const Product = require("../models/product");


const getProductsById = async (req, res) => {
    try {
        const productIds = req.body;
        const products = await Product.find({ "_id": { "$in": productIds } }).lean();
        res.json(products);
    } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
}

const getProduct = async (req, res) => {
    // Logica per ottenere un utente
    try {
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
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        res.json(product);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

const createProduct = async (req, res) => {
        try {
            const productName = req.body.name;

            // Verifica se esiste già un prodotto con lo stesso nome
            const existingProduct = await Product.findOne({ name: productName });
            if (existingProduct) {
                // Se il prodotto esiste già, restituisci un errore
                res.json({ msg: "Il prodotto con questo nome esiste già", result: 1 });
            }else {
                // Se non esiste un prodotto con lo stesso nome, crea il prodotto
                await Product.create(req.body);
                res.json({msg: "Prodotto creato con successo!", result: 2});
            }
        } catch (error) {
            console.error("Errore nella creazione del prodotto:", error );
            res.status(400).json({ msg: "Errore generico"});
        }
}



module.exports = {
    getProduct,
    createProduct,
    getSingleProduct,
    getProductsById
}

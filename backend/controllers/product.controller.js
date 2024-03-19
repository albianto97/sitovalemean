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
            const productType = req.body.type;

            // Verifica se esiste già un prodotto con lo stesso nome
            const existingProduct = await Product.findOne({ name: productName, type: productType });


            if (existingProduct) {
                // Se il prodotto esiste già, restituisci un errore
                res.json({ msg: "Il prodotto con questo nome esiste già", result: 1 });
            }else {
                // Se non esiste un prodotto con lo stesso nome o type, crea il prodotto
                await Product.create(req.body);
                res.json({msg: "Prodotto creato con successo!", result: 2});
            }
        } catch (error) {
            console.error("Errore nella creazione del prodotto:", error );
            res.status(400).json({ msg: "Errore generico"});
        }
}
const incrementProductQuantity = async (req, res) => {
    const productId = req.params.productId;
    let quantityToAdd = 1; // Default value

    if (req.body.quantityToAdd) {
        quantityToAdd = req.body.quantityToAdd;
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Incrementa la quantità del prodotto
        product.disponibilita += quantityToAdd;

        // Salva le modifiche nel database
        await product.save();

        res.json({ message: 'Quantità del prodotto aggiornata con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della quantità del prodotto:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

const decrementProductQuantity = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Incrementa la quantità disponibile del prodotto
        product.disponibilita -= 1;

        // Salva le modifiche nel database
        await product.save();

        res.json({ message: 'Quantità del prodotto decrementata con successo' });
    } catch (error) {
        console.error('Errore durante il decremento della quantità del prodotto:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};
const quantity0 = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Incrementa la quantità disponibile del prodotto
        product.disponibilita  = 0;

        // Salva le modifiche nel database
        await product.save();

        res.json({ message: 'Quantità del prodotto decrementata con successo' });
    } catch (error) {
        console.error('Errore durante il decremento della quantità del prodotto:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        // Trova e rimuovi il prodotto dal database
        const deletedProduct = await Product.findByIdAndRemove(productId);
        if (deletedProduct) {
            res.status(200).json({ message: 'Prodotto eliminato con successo' });
        } else {
            res.status(404).json({ message: 'Prodotto non trovato' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione del prodotto' });
    }
};



module.exports = {
    getProduct,
    createProduct,
    getSingleProduct,
    getProductsById,
    incrementProductQuantity,
    decrementProductQuantity,
    deleteProduct,
    quantity0
}

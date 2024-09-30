const Product = require("../models/product");
const Order = require("../models/order");


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
const getTopProducts = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Costruisci il filtro data
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.creationDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            dateFilter.creationDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            dateFilter.creationDate = { $lte: new Date(endDate) };
        }

        const topProducts = await Product.aggregate([
            {
                $lookup: {
                    from: "orders",
                    let: { productId: "$_id" },
                    pipeline: [
                        { $match: dateFilter },
                        { $unwind: "$products" },
                        {
                            $match: {
                                $expr: { $eq: ["$products.productId", "$$productId"] }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalQuantity: { $sum: "$products.quantity" }
                            }
                        }
                    ],
                    as: "orderDetails"
                }
            },
            {
                $addFields: {
                    totalQuantity: { $ifNull: [{ $arrayElemAt: ["$orderDetails.totalQuantity", 0] }, 0] }
                }
            },
            {
                $project: {
                    _id: "$_id",
                    productId: "$_id",
                    name: 1,
                    description: 1,
                    price: 1,
                    disponibilita: 1,
                    type: 1,
                    totalQuantity: 1
                }
            },
            { $sort: { totalQuantity: -1 } },
            // { $limit: 10 } // Puoi modificare questo valore per restituire più o meno prodotti
        ]);

        res.json(topProducts);
    } catch (err) {
        console.error('Error fetching top products', err);
        res.status(500).send('Internal Server Error');
    }
};
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
        } else {
            // Se non esiste un prodotto con lo stesso nome o type, crea il prodotto
            await Product.create(req.body);
            res.json({ msg: "Prodotto creato con successo!", result: 2 });
        }
    } catch (error) {
        console.error("Errore nella creazione del prodotto:", error);
        res.status(400).json({ msg: "Errore generico" });
    }
}
const incrementProductQuantity = async (req, res) => {
    const productId = req.params.productId;
    let quantityToAdd = 1; // Default value

    if (req.body.quantityToAdd) {
        quantityToAdd = req.body.quantityToAdd;
    }

    try {
        let notify = false;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        if (product.disponibilita === 0)
            notify = true;
        // Incrementa la quantità del prodotto
        product.disponibilita += quantityToAdd;


        // Salva le modifiche nel database
        await product.save();

        if (notify) socket.emit('productAvailable', { message: 'Il prodotto ' + product.name + ' è tornato disponibile' });
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
        product.disponibilita = 0;

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

        // Check if the product is present in any order
        const orderContainingProduct = await Order.findOne({ 'products.productId': productId });
        if (orderContainingProduct) {
            return res.json({ message: 'Il prodotto è presente in uno o più ordini e non può essere eliminato', result: 2 });
        }

        // Find and remove the product from the database
        const deletedProduct = await Product.findByIdAndRemove(productId);
        if (deletedProduct) {
            res.json({ message: 'Prodotto eliminato con successo', result: 0 });
        } else {
            res.json({ message: 'Prodotto non trovato', result: 1 });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione del prodotto' });
    }
};
const updateProductDescription  = async (req, res) => {
    const { productId } = req.params;
    const { description } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, { description }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Errore del server');
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
    quantity0,
    updateProductDescription,
    getTopProducts
}

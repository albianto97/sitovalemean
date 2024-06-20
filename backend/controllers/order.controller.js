const Order = require("../models/order");
const jwt = require('jsonwebtoken');
const Product = require("../models/product");
const User = require("../models/user");

const getAllOrders = async (req, res) => {
    // Logica per ottenere ordini
    const orders = await Order.find().sort({ creationDate: -1 });
    res.json(orders);

    //res.send(res.json);
}

 const getTotalEarnings = async (req, res) => {
    const { startDate, endDate } = req.query;

    let start, end;
    if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
    } else {
        // Recupera la data del primo ordine
        const firstOrder = await Order.findOne().sort({ creationDate: 1 });
        start = firstOrder ? firstOrder.creationDate : new Date();
        end = new Date();
    }
    try {
        const result = await Order.aggregate([
            {
                $match: {
                    creationDate: { $gte: start, $lte: end }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } }
                }
            }
        ]);

        const totalEarnings = result.length > 0 ? result[0].totalEarnings : 0;

        res.json({ totalEarnings });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Funzione per generare una sequenza di date
const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};


const getOrdersForDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    let start, end;
    if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
    } else {
        // Recupera la data del primo ordine
        const firstOrder = await Order.findOne().sort({ creationDate: 1 });
        start = firstOrder ? firstOrder.creationDate : new Date();
        end = new Date();
    }

    let matchStage = {
        creationDate: { $gte: start, $lte: end }
    };

    try {
        const result = await Order.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$creationDate" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Genera la sequenza di date
        const dateRange = generateDateRange(start, end);

        // Crea un oggetto per mappare le date e i conteggi
        const countMap = result.reduce((map, item) => {
            map[item._id] = item.count;
            return map;
        }, {});

        // Popola il risultato finale con 0 per i giorni mancanti
        const finalResult = dateRange.map(date => {
            const dateString = date.toISOString().split('T')[0];
            return {
                _id: dateString,
                count: countMap[dateString] || 0
            };
        });

        res.json(finalResult);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const searchOrdersByUsername = async (req, res) => {
    try {
        const username = req.query.username;
        const status = req.query.status;
        const users = await User.find({ username: { $regex: '^' + username } }, { "_id": 1, "username": 1 }).lean();
        const userIds = users.map(u =>
            Object.assign({}, { _id: u._id })
        );
        let orders;
        if (status)
            orders = await Order.find({ user: { "$in": userIds }, status: status }, { "_id": 1, "status": 1, "creationDate": 1, "productsCount": { "$size": "$products" }, "user": 1 }).lean();
        else
            orders = await Order.find({ user: { "$in": userIds } }, { "_id": 1, "status": 1, "creationDate": 1, "productsCount": { "$size": "$products" }, "user": 1 }).lean();
        orders = orders.map(o => {
            let userId = o.user;
            let user = users.filter(u => u._id.equals(userId));
            if (user.length > 0) {
                o.username = user[0].username;
            }
            return o;

        })
        res.json(orders);
    } catch (err) {
        console.error('Errore nel recupero dei ordini:', err);
        res.status(500).json({ message: 'Errore del server' });
    }

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
        let sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);
        sortedProducts = sortedProducts.slice(0, 3);

        // Ottieni i dettagli dei prodotti più acquistati
        const bestProductsData = await Product.find({ _id: { $in: sortedProducts } });

        // Costruisci un array di oggetti per ciascun prodotto con il conteggio
        const bestProducts = bestProductsData.map(product => {
            let p = Object.assign(product._doc, { count: productCounts[product._id] });

            return p;
        });

        // Ordina bestProducts in base all'ordine degli ID specificato in sortedProducts
        let orderedBestProducts = [];
        sortedProducts.forEach(productId => {
            let product = bestProducts.find(p => p._id.toString() === productId);
            if (product) {
                orderedBestProducts.push(product);
            }
        });

        res.json({ bestProducts: orderedBestProducts });

    } catch (err) {
        console.error('Errore nel recupero dei prodotti:', err);
        res.status(500).json({ message: 'Errore del server' });
    }

};

const getOrdersFromUser = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var user = jwt.decode(token);
    try {
        const ordini = await Order.find({ user: user._id }).sort({ creationDate: -1 });
        res.json(ordini);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateQuantities(products) {
    for (i = 0; i < products.length; i++) {
        let current = products[i];
        const DBproduct = await Product.findOne({ _id: current.productId }).lean();
        let newQuantity = DBproduct.disponibilita - current.quantity;
        let result = await Product.updateOne({ _id: current.productId }, { disponibilita: newQuantity });
    }
}

const createOrder = async (req, res) => {
    try {
        let unavailableProducts = await checkOrderQuantities(req.body);
        if (unavailableProducts.length === 0) {
            const newOrder = await Order.create(req.body);
            await updateQuantities(req.body.products);
            res.json({ msg: "Ordine creato con successo!", order: newOrder, result: 0 });
        } else {
            res.json({ msg: "Errore nel ordine", order: null, result: 1, products: unavailableProducts });
        }
    } catch (e) {
        res.status(400).send(e);
    }
}
// aggiornamento dell'ordine
const updateOrder = async (req, res) => {
    try {
        const orderId = req.body._id; // Ottieni l'ID dell'ordine dalla richiesta

        // Controlla se l'ordine esiste nel database
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ msg: "Ordine non trovato" });
        }

        // Aggiorna l'ordine nel database
        const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true });

        // Controlla se l'aggiornamento è avvenuto con successo
        if (!updatedOrder) {
            return res.status(400).json({ msg: "Impossibile aggiornare l'ordine" });
        }

        // Se l'aggiornamento è avvenuto con successo, rispondi con l'ordine aggiornato
        res.json({ msg: "Ordine aggiornato con successo", order: updatedOrder });
    } catch (error) {
        // Gestisci eventuali errori
        console.error("Errore nell'aggiornamento dell'ordine:", error);
        res.status(500).json({ msg: "Errore interno del server" });
    }
};


const checkOrderQuantities = async (order) => {
    let unavailableProducts = [];
    let products = order.products;
    for (i = 0; i < products.length; i++) {
        let p = products[i];
        let pDocument = await Product.findOne({ "_id": p.productId }).lean();
        if (pDocument.disponibilita < p.quantity)
            unavailableProducts.push(pDocument);
    }
    return unavailableProducts;
}


module.exports = {
    createOrder,
    getOrderOfUserProduct,
    getOrdersFromUser,
    getAllOrders,
    getTotalEarnings,
    getOrdersForDate,
    getOrder,
    searchOrdersByUsername,
    updateOrder
}

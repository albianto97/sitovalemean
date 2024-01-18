const Order = require("../models/order");
const jwt = require('jsonwebtoken');

const getOrderOfUser =async (req, res) => {
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
    getOrderOfUser
}

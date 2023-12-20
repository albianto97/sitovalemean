const Order = require("../models/order");

const createOrder = async (req, res) => {
    try {
        const newUser = await Order.create(req.body);
        res.json({ msg: "Ordine creato con successo!", user: newUser });
    } catch (e) {
        res.status(400).send(e);
    }
}


module.exports = {
    createOrder
}

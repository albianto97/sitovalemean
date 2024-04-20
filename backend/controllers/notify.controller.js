const Notify = require('../models/notify');

// Creazione di una nuova notifica
const createNotification = async (req, res) => {
    try {
        const { username, message, orderId } = req.body;
        const orderStringId = orderId.toString(); // Converti l'ObjectId in una stringa
        const notification = new Notify({
            username,
            message,
            orderId: orderStringId
        });


        await notification.save();

        res.status(201).json({ success: true, notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Errore durante la creazione della notifica' });
    }
};


module.exports = {
    createNotification
}

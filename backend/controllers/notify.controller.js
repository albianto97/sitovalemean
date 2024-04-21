const Notify = require('../models/notify');

// Creazione di una nuova notifica
const createNotification = async (req, res) => {
    try {
        const { username, date, message, orderId } = req.body;
        const orderStringId = orderId.toString(); // Converti l'ObjectId in una stringa
        // Controlla se notifyDate è una stringa ISO 8601 valida
        if (!isNaN(new Date(date).getTime())) {
            // Converti la stringa in un oggetto Date
            const notification = new Notify({
                username,
                notifyDate: new Date(date),
                message,
                orderId: orderStringId
            });

            await notification.save();

            res.status(201).json({ success: true, notification });
        } else {
            // Se la stringa non è una data valida, restituisci un errore
            res.status(400).json({ success: false, message: 'Data di notifica non valida' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Errore durante la creazione della notifica' });
    }
};


const getUserNotifications = async (req, res) => {
    try {
        const username = req.params.username;

        // Trova tutte le notifiche per l'utente specificato
        const notifications = await Notify.find({ username }).lean();

        res.status(200).json(notifications); // Invia direttamente le notifiche come array
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Errore durante il recupero delle notifiche dell\'utente' });
    }
};





module.exports = {
    createNotification,
    getUserNotifications
}

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
const getUserNotifications = async (req, res) => {
    try {
        const username = req.params.username;

        // Trova tutte le notifiche per l'utente specificato
        console.log("Username:", username); // Assicurati che l'username sia corretto
        const notifications = await Notify.find({ username });

        console.log("Notifications:", notifications); // Controlla se le notifiche sono state trovate correttamente

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Errore durante il recupero delle notifiche dell\'utente' });
    }
};



module.exports = {
    createNotification,
    getUserNotifications
}

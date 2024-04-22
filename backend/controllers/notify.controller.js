const Notify = require('../models/notify');
const Product = require("../models/product");

// Creazione di una nuova notifica
const createNotification = async (req, res) => {
    try {
        const { username, date,read, message, orderId } = req.body;
        const orderStringId = orderId.toString(); // Converti l'ObjectId in una stringa
        // Controlla se notifyDate è una stringa ISO 8601 valida
        if (!isNaN(new Date(date).getTime())) {
            // Converti la stringa in un oggetto Date
            const notification = new Notify({
                username,
                notifyDate: new Date(date),
                message,
                read,
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
const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        // Controlla se l'ID della notifica è valido
        const deletedNotify = await Notify.findByIdAndRemove(notificationId);
        if (deletedNotify) {
            res.status(200).json({ message: 'Notifica eliminata con successo' });
        } else {
            res.status(404).json({ message: 'Notifica non trovato' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione della notifica:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione della notifica' });
    }
};
const updateNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        // Controlla se la notifica esiste nel database
        const notification = await Notify.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notifica non trovata' });
        }

        // Imposta lo stato di lettura della notifica
        notification.read = req.body.read;

        // Salva la notifica aggiornata nel database
        await notification.save();

        res.status(200).json({ success: true, message: 'Stato di lettura della notifica aggiornato con successo' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Errore durante l\'aggiornamento dello stato di lettura della notifica' });
    }
};


module.exports = {
    createNotification,
    getUserNotifications,
    deleteNotification,
    updateNotification
}

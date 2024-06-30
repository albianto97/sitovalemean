// Importa i modelli di dati Message e User
const Message = require('../models/chat');
const User = require("../models/user");

// Funzione asincrona per creare una chat
const createChat = async (senderUsername, receiverUsername, messageContent) => {
    try {
        // Cerca il mittente e il destinatario nel database tramite i loro username
        const sender = await User.findOne({ username: senderUsername });
        if (receiverUsername != 'amministrazione') {
            var receiver = await User.findOne({ username: receiverUsername });
            // Crea un nuovo messaggio
            const message = new Message({
                from: sender._id,
                to: receiver._id,
                content: messageContent
            });
            // Salva il messaggio nel database
            const newChat = await Message.create(message);
        } else {
            const selectField = { _id: 1, username: 1, ruolo: 1 };
            var receivers = await User.find({ "ruolo": "amministratore" }, selectField).lean();
            receivers.forEach(async (receiver) => {
                // Crea un nuovo messaggio
                const message = new Message({
                    from: sender._id,
                    to: receiver._id,
                    content: messageContent
                });
                // Salva il messaggio nel database
                const newChat = await Message.create(message);
            })
        }
    } catch (error) {
        // Gestisce gli errori e li stampa su console
        console.log(error)
    }
};


const getChatForUser = async (req, res) => {
    try {
        // Verifica se devono essere recuperati solo i destinatari online
        const onlineReceivers = req.query.onlineReceivers == 'true';
        const userId = req.params.userId;

        // Seleziona i campi da recuperare per gli utenti
        const selectField = { _id: 1, username: 1, ruolo: 1 };
        const sender = await User.findOne({ _id: userId }, selectField).lean();

        if (!sender) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        let receivers = [];
        let messages = [];

        // Se l'utente è un amministratore, recupera tutti gli utenti che non sono amministratori
        if (sender.ruolo == "amministratore") {
            // Trova tutti gli utenti che non sono amministratori
            receivers = await User.find({ "ruolo": { $ne: "amministratore" } }, selectField).lean();

            // Filtra i destinatari online se richiesto
            if (onlineReceivers) {
                receivers = receivers.filter(r => {
                    let socket = req.socketsByUsername[r.username];
                    return (socket && socket.connected);
                });
            }

            // Recupera gli ID degli amministratori
            const adminIds = (await User.find({ "ruolo": "amministratore" }, '_id')).map(admin => admin._id);

            // Trova tutti i messaggi inviati e ricevuti dai destinatari non amministratori e dagli amministratori
            for (let receiver of receivers) {
                const receiverMessages = await Message.find({
                    $or: [
                        { to: receiver._id },
                        { from: { $in: adminIds }, to: receiver._id },
                        { from: receiver._id, to: userId }
                    ]
                })
                    .populate('from', 'username')
                    .populate('to', 'username')
                    .lean();

                messages = messages.concat(receiverMessages);
            }
        } else {
            // Se l'utente non è un amministratore, recupera tutti gli amministratori
            receivers = await User.find({ "ruolo": "amministratore" }, selectField).lean();

            if (onlineReceivers) {
                receivers = receivers.filter(r => {
                    let socket = req.socketsByUsername[r.username];
                    return (socket && socket.connected);
                });
            }

            // Trova i messaggi inviati dall'utente a qualsiasi amministratore e viceversa
            messages = await Message.find({
                $or: [
                    { from: userId, to: receivers[0]._id },
                    { from: { $in: receivers.map(r => r._id) }, to: userId }
                ]
            })
                .populate('from', 'username')
                .populate('to', 'username')
                .lean();

            // Modifica il campo 'to' per far sembrare che i messaggi degli amministratori provengano da una singola entità
            messages.forEach(message => {
                if (receivers.map(r => r._id.toString()).includes(message.from._id.toString())) {
                    message.from.username = 'amministrazione';
                }
                if (receivers.map(r => r._id.toString()).includes(message.to._id.toString())) {
                    message.to.username = 'amministrazione';
                }
            });
            receivers = receivers.slice(0, 1)
            receivers[0].username = 'amministrazione'
            console.log(receivers);
        }

        // Ordina tutti i messaggi cronologicamente
        messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Prepara la risposta da inviare al client
        const response = {
            "sender": sender,
            "receiver": receivers,
            "messages": messages,
            usersWithNewMessages: getUsersWithNewMessages(sender.username, req.newMessages)
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Funzione asincrona per eliminare le chat di un utente
const deleteChat = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ "username": username }).lean();
        const userId = user._id;

        // Elimina tutte le chat in cui l'ID corrisponde a 'from' o 'to'
        const deletedChats = await Message.deleteMany({
            $or: [{ from: userId }, { to: userId }]
        });

        if (deletedChats.deletedCount > 0) {
            let socket = req.socketsByUsername[username];
            socket.emit("chatDeleted", {});
            res.status(200).json({ message: 'Chat eliminate con successo' });
        } else {
            res.status(404).json({ message: 'Nessuna chat trovata' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione delle chat:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione delle chat' });
    }
};

// Funzione asincrona per ottenere gli username di tutti gli utenti che hanno inviato messaggi
const getChatUserOpen = async (req, res) => {
    try {
        let allUsernames = [];
        const allIds = await Message.distinct('from');
        for (let id of allIds) {
            const user = await User.findById(id);
            if (user) {
                allUsernames.push(user.username);
            }
        }
        res.status(200).json({ allUsernames });
    } catch (error) {
        console.error('Errore durante il recupero degli username:', error);
        res.status(500).json({ message: 'Errore del server durante il recupero degli username' });
    }
};

// Funzione per ottenere gli utenti che hanno nuovi messaggi
function getUsersWithNewMessages(user, newMessagesDictionary) {
    let keys = Object.keys(newMessagesDictionary);
    let newMessages = [];
    for (let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let from_to = currentKey.split("|");
        if (from_to.length == 2 && from_to[1] == user && newMessagesDictionary[currentKey] == true) {
            newMessages.push(from_to[0]);
        }
    }
    return newMessages;
}

// Esporta le funzioni per essere utilizzate in altri moduli
module.exports = {
    createChat, getChatForUser, deleteChat, getChatUserOpen
};

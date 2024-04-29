const User = require('../models/user');
const Message = require('../models/chat');
const Notify = require("../models/notify");

const createChat = async (senderUsername, receiverUsername, messageContent) => {
    try {
        // Cerca gli utenti nel database
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });

        // Crea un nuovo messaggio
        const message = new Message({
            from: sender._id,
            to: receiver._id,
            content: messageContent
        });
        const newChat = await Message.create(message);


    } catch (error) {
        console.log("ciao errore");

    }
};

const getChatForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Trova i messaggi inviati da e verso l'utente stesso o dall'admin verso l'utente
        const messages = await Message.find({
            $or: [{ from: userId  }, { to: userId }]}).populate('from', 'username')
            .populate('to', 'username').lean();
        const selectField = {_id: 1, username: 1};
        const sender = await User.findOne({_id: userId}, selectField).lean();
        let receiverIds =[];
        for(let i = 0; i < messages.length; i++){
            let from = messages[i].from._id.toString()
            if(receiverIds.indexOf(from) == -1){
                receiverIds.push(from)
            }
            let to = messages[i].to._id.toString()
            if(receiverIds.indexOf(to) == -1){
                receiverIds.push(to)
            }
        }
        receiverIds = receiverIds.filter( u=> u != userId);
        const recivers = await User.find({ "_id": { "$in": receiverIds } }, selectField).lean();
        const response = {
            "sender" : sender, "receiver": recivers, "messages": messages
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const deleteChat = async (req, res) => {
    try {
        const userId = req.params.id;

        // Elimina tutte le chat in cui l'ID corrisponde a 'from' o 'to'
        const deletedChats = await Chat.deleteMany({
            $or: [{ from: userId }, { to: userId }]
        });

        if (deletedChats.deletedCount > 0) {
            res.status(200).json({ message: 'Chat eliminate con successo' });
        } else {
            res.status(404).json({ message: 'Nessuna chat trovata' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione delle chat:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione delle chat' });
    }
};



module.exports ={
    createChat, getChatForUser, deleteChat
};

const Message = require('../models/chat');
const User = require("../models/user");


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
        const onlineReceivers = req.query.onlineReceivers == 'true';
        const userId = req.params.userId;
        // Trova i messaggi inviati da e verso l'utente stesso o dall'admin verso l'utente
        const messages = await Message.find({
            $or: [{ from: userId  }, { to: userId }]}).populate('from', 'username')
            .populate('to', 'username').lean();
        const selectField = {_id: 1, username: 1, ruolo: 1};
        const sender = await User.findOne({_id: userId}, selectField).lean();
        let receivers = [];
        if(sender.ruolo == "amministratore") {
            let receiverIds = [];
            for (let i = 0; i < messages.length; i++) {
                let from = messages[i].from._id.toString()
                if (receiverIds.indexOf(from) == -1) {
                    receiverIds.push(from)
                }
                let to = messages[i].to._id.toString()
                if (receiverIds.indexOf(to) == -1) {
                    receiverIds.push(to)
                }
            }
            receiverIds = receiverIds.filter(u => u != userId);
            receivers = await User.find({"_id": {"$in": receiverIds}}, selectField).lean();
            if(onlineReceivers){
                receivers = receivers.filter( r => {
                    let socket = req.socketsByUsername[r.username];
                    return (socket && socket.connected);
                })
            }
        }
        else {
            const adminUsers = await User.find({"ruolo": "amministratore"}, selectField).lean();
            for(i = 0; i< adminUsers.length; i++){
                if(onlineReceivers) {
                    let socket = req.socketsByUsername[adminUsers[i].username];
                    if (socket && socket.connected)
                        receivers.push(adminUsers[i]);
                }else{
                    receivers.push(adminUsers[i]);
                }
            }
        }
        const response = {
            "sender" : sender, "receiver": receivers, "messages": messages, usersWithNewMessages: getUsersWithNewMessages(sender.username, req.newMessages)
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//todo: da testare
const deleteChat = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({"username" : username}).lean();
        const userId = user._id;
        // Elimina tutte le chat in cui l'ID corrisponde a 'from' o 'to'
        const deletedChats = await Message.deleteMany({
            $or: [{ from: userId }, { to: userId }]
        });

        if (deletedChats.deletedCount > 0) {
            let socket = req.socketsByUsername[username];
            socket.emit("chatDeleted" , {});
            res.status(200).json({ message: 'Chat eliminate con successo' });
        } else {
            res.status(404).json({ message: 'Nessuna chat trovata' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione delle chat:', error);
        res.status(500).json({ message: 'Errore del server durante l\'eliminazione delle chat' });
    }
};

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

function getUsersWithNewMessages(user, newMessagesDictionary){
    let keys= Object.keys(newMessagesDictionary);
    let newMessages = [];
    for(i = 0; i< keys.length; i++){
        let currentKey= keys[i];
        let from_to = currentKey.split("|");
        if (from_to.length == 2 && from_to[1] == user && newMessagesDictionary[currentKey] == true){
            newMessages.push(from_to[0]);
        }
    }
    return newMessages;
}


module.exports ={
    createChat, getChatForUser, deleteChat, getChatUserOpen
};

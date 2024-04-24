const User = require('../models/user');
const Message = require('../models/chat');
const Order = require("../models/order");

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
        //res.json({msg: "Ordine creato con successo!", order: newOrder, result : 0});

    } catch (error) {
        //res.json({msg: "Errore nel ordine"});
        console.log("ciao errore")

    }
};
const getChat = async (req, res) => {
    try {
        const userId = req.params.userId;
        const messages = await ChatMessage.find({ $or: [{ from: userId }, { to: userId }] })
            .populate('from', 'username')
            .populate('to', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports ={
    createChat, getChat
};

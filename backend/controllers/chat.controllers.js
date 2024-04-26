const User = require('../models/user');
const Message = require('../models/chat');


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

const getChatForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Trova i messaggi inviati da e verso l'utente stesso o dall'admin verso l'utente
        const messages = await Message.find({
            $or: [
                { $and: [{ from: userId }, { to: '65ce873f9a6f5740c5b268ad' }] }, // Messaggi inviati da e verso l'utente stesso
                { $and: [{ from: '65ce873f9a6f5740c5b268ad' }, { to: userId }] } // Messaggi inviati dall'admin all'utente
            ]
        }).populate('from', 'username')
            .populate('to', 'username').lean();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports ={
    createChat, getChatForUser
};

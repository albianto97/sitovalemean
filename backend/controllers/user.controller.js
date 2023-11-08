const User = require("../models/user");

const getUser = async (req, res) => {
    // Logica per ottenere un utente
    const users = await User.find();
    res.json(users);

    //res.send(res.json);
}
const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: 'Utente non trovato'});
        }

        res.json(user);
    } catch (error) {
        console.error('Errore durante il recupero dell\'utente:', error);
        res.status(500).json({message: 'Errore del server'});
    }
};
const createUser = async (req, res) => {
    console.log(req)
    User.create(req.body)
        .then(() => res.json({ msg: "Utente creato con successo!" }))
        .catch(() => res.status(400).json({ msg: "Errore nella creazione" }));
}

module.exports = {
    getUser,
    createUser,
    getSingleUser
}

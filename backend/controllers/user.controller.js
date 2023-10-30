const User = require("../models/user");

const getUser = async (req, res) => {
    // Logica per ottenere un utente
    const users = await User.find();
    res.json(users);

    //res.send(res.json);
}
const createUser = async (req, res) => {
    console.log(req)
    User.create(req.body)
        .then(() => res.json({ msg: "Utente creato con successo!" }))
        .catch(() => res.status(400).json({ msg: "Errore nella creazione" }));
}

module.exports = {
    getUser,
    createUser
}
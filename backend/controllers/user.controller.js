const bcrypt = require('bcrypt');
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

const login = async (req, res) => {
    try {
        // Cerca l'utente nel database usando await
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).json({ isValid: false, message: "User not found" });
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ isValid: false, message: "Incorrect password" });
        }
        return res.status(200).json({ isValid: true, message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ isValid: false, message: err.message });
    }
}

module.exports = {
    getUser,
    createUser,
    login
}
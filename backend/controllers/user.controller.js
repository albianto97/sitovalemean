const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        console.error('Errore durante il recupero dell\'utente:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};
const createUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUsername) {
            return res.status(409).json({error: "Conflict",message: "L'username è già utilizzato"});
        }
        if (existingEmail) {
            return res.status(422).json({error: "Conflict",message: "L'email è già associata ad un altro utente"});
        }
        const newUser = await User.create(req.body);
        res.json({ message: "Utente creato con successo!", user: newUser });
    } catch (error) {
        console.error('Errore nella creazione dell\'utente:', error);
        res.status(500).json({ message: "Errore nella creazione dell'utente." });
    }
};

const login = async (req, res) => {
    try {
        // Cerca l'utente nel database usando await
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).json({ isValid: false, message: "User not found" });
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ isValid: false, message: "Incorrect password" });
        }
        const token = jwt.sign({ _id: user._id, username: user.username }, 'chiaveSegreta');
        
        return res.status(200).json({ isValid: true, message: "Login successful", token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ isValid: false, message: err.message });
    }
}

module.exports = {
    getUser,
    createUser,
    getSingleUser,
    login
}

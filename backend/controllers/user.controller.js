const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const getUser = async (req, res) => {
    // Logica per ottenere un utente
    const users = await User.find();
    res.json(users);

    //res.send(res.json);
}
const getProfile = async (req, res) => {
    try {
        // Utilizza il middleware di autenticazione per ottenere l'ID dell'utente dal token
        const userId = req.userId;
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

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Nome utente o email già registrati.', specificMessage: 'Errore nella creazione' });
        }

        const newUser = await User.create(req.body);
        res.json({ msg: "Utente creato con successo!", user: newUser });
    } catch (error) {
        console.error('Errore nella creazione dell\'utente:', error);
        res.status(500).json({ msg: "Errore nella creazione dell'utente." });
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

        // Crea un token di gestione utente
        const token = jwt.sign({ id: user._id }, 'A123B456C789', { expiresIn: '1h' });

        return res.status(200).json({ isValid: true, message: "Login successful", token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ isValid: false, message: err.message });
    }
}

module.exports = {
    getUser,
    createUser,
    getProfile,
    login
}

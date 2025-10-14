import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Dati mancanti' });
        }
        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: 'Email già registrata' });

        const user = await User.create({ username, email, password, role: role === 'admin' ? 'admin' : 'user' });
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Errore registrazione', error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }
        const token = signToken(user);
        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Errore login', error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Errore recupero profilo', error: err.message });
    }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    await user.save();

    res.json({ message: 'Profilo aggiornato con successo', user });
  } catch (error) {
    res.status(500).json({ message: 'Errore aggiornamento profilo', error });
  }
};

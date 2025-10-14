import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';



const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Utente registrato con successo',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error('Errore nella registrazione:', err);
        res.status(500).json({ message: 'Errore durante la registrazione.' });
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

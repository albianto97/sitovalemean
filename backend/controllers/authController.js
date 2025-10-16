import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';
import { User } from '../models/userModel.js';

// 🔑 Funzione per creare token JWT
const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

// 🧾 REGISTRAZIONE
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Nome utente ed email sono obbligatori.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata.' });
    }

    // 🔑 Genera password random se non fornita
    const plainPassword = password || crypto.randomBytes(5).toString('hex');

    const newUser = new User({ username, email, password: plainPassword });
    await newUser.save();

    // ✉️ Email di benvenuto
    await sendEmail(
      email,
      'Benvenuto nella tua Lista Regali 🎁',
      `
      Ciao <b>${username}</b>,<br><br>
      il tuo account è stato creato con successo.<br>
      Password iniziale: <code>${plainPassword}</code><br><br>
      Ti consigliamo di cambiarla subito dopo l’accesso.
      `
    );

    res.status(201).json({
      message: 'Utente registrato con successo',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (err) {
    console.error('Errore nella registrazione:', err);
    res.status(500).json({ message: 'Errore durante la registrazione.' });
  }
};

// 🔐 LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // ✅ Usa il metodo definito nel modello
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        const token = signToken(user);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Errore nel login:', err);
        res.status(500).json({ message: 'Errore durante il login', error: err.message });
    }
};

// 👤 PROFILO
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.json(user);
    } catch (err) {
        console.error('Errore profilo:', err);
        res.status(500).json({ message: 'Errore recupero profilo', error: err.message });
    }
};

// ✏️ UPDATE PROFILO
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        await user.save();

        res.json({ message: 'Profilo aggiornato con successo', user });
    } catch (error) {
        console.error('Errore aggiornamento profilo:', error);
        res.status(500).json({ message: 'Errore aggiornamento profilo', error });
    }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utente non trovato.' });

    // Token reset
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Salva token hashato nel DB (opzionale)
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minuti
    await user.save();

    // ✉️ Email
    await sendEmail(
      user.email,
      'Recupero password Lista Regali 🎁',
      `
      Ciao <b>${user.username}</b>,<br>
      Hai richiesto di reimpostare la tua password.<br>
      Clicca qui sotto per procedere (valido per 10 minuti):<br><br>
      <a class="btn" href="${resetURL}">Reimposta Password</a>
      `
    );

    res.json({ message: 'Email inviata con le istruzioni per il reset.' });
  } catch (err) {
    console.error('Errore forgotPassword:', err);
    res.status(500).json({ message: 'Errore invio email di recupero.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Token invalido o scaduto.' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    await sendEmail(
      user.email,
      'Password aggiornata con successo 🔒',
      `Ciao <b>${user.username}</b>,<br>
       la tua password è stata modificata correttamente.<br>
       Se non sei stato tu, contatta subito il supporto.`
    );

    res.json({ message: 'Password aggiornata con successo' });
  } catch (err) {
    console.error('Errore reset password:', err);
    res.status(500).json({ message: 'Errore durante il reset password.' });
  }
};


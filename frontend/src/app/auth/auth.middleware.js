const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ottieni il token dall'header della richiesta
  const token = req.header('Authorization');

  // Verifica se il token è presente
  if (!token) {
    return res.status(401).json({ message: 'Accesso non autorizzato' });
  }

  try {
    // Verifica il token e ottieni i dati decodificati
    const decoded = jwt.verify(token, 'A123B456C789');

    // Aggiungi l'ID dell'utente decodificato all'oggetto richiesta
    req.userId = decoded.id;

    // Passa alla successiva funzione di middleware
    next();
  } catch (error) {
    // Token non valido
    res.status(401).json({ message: 'Token non valido' });
  }
};

module.exports = authMiddleware;

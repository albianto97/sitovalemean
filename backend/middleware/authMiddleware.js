import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ message: 'Token mancante' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch {
        return res.status(401).json({ message: 'Token non valido' });
    }
};


// ✅ Middleware opzionale (non obbliga a essere loggato)
export const authOptional = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(); // nessun token → continua senza user

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    req.user = null;
  }
  next();
};

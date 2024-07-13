const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token is missing' });

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
}

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token is missing' });

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    if (user.role === 'amministratore') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  });
}
function getUsernameFromJWT(token, callback) {
  return jwt.verify(token, config.jwtSecret, callback);
}
module.exports = {
  verifyToken,
  verifyAdminToken,
  getUsernameFromJWT
};

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// const jwt = require('jsonwebtoken');

// function verificaToken(req, res, next) {
//   const token = req.header('auth-token');
//   if (!token) return res.status(401).send('Accesso negato');

//   try {
//     const verified = jwt.verify(token, 'chiaveSegreta');
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).send('Token non valido');
//   }
// }

module.exports = {
    verifyToken
};
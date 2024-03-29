const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const token = require('./middlewares/token');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
//const io = socketIo(server);

// Middleware per gestire le richieste CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Gestione della connessione dei socket
/*io.on('connection', (socket) => {
  console.log('Nuova connessione socket:', socket.id);

  // Gestisci l'evento di invio della notifica
  socket.on('sendNotification', (data) => {
    console.log('Richiesta di notifica ricevuta:', data);

    // Invia la notifica a tutti i client connessi
    io.emit('notification', data);
  });
});*/

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use(token.verifyToken);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

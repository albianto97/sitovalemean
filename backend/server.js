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
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET, POST, PUT, DELETE']
  }
});

// Middleware per gestire le richieste CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Gestisci l'evento di invio della notifica



app.use(bodyParser.json());

const port = process.env.PORT || 3000;

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use(token.verifyToken);
io.on('connection', (socket) => {
    console.log('Nuova connessione socket:', socket.id);
    socket.on('test', (data) =>{
      console.log("message: " + JSON.stringify(data)); //in console mandare messaggio emit di test --> lui ascolta
    })
    socket.emit("welcome", "benvenuto nel socket, " + socket.id); //singolo
    io.emit("welcome", "nuova connessione: " + socket.id); //broadcast

    socket.on('sendNotification', (data) => {
        console.log('Richiesta di notifica ricevuta:', data);

        //Invia la notifica a tutti i client connessi
        io.emit('notification', data);
    });
});
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


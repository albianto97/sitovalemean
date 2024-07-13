const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const config = require('./config');
const { verifyToken, verifyAdminToken, getUsernameFromJWT } = require('./middlewares/token');

const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const notificationRoutes = require('./routes/notify.route');
const chatRoute = require('./routes/chat.routes');
const rawIngredentsRoutes = require('./routes/rawIngredients.route');
const stockRoutes = require('./routes/stock.route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

let socketsByUsername = {};
let newMessages = {};

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.socketServer = io;
  req.socketsByUsername = socketsByUsername;
  req.newMessages = newMessages;
  next();
});

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/chat', chatRoute);
app.use('/api/stock', stockRoutes);
app.use('/api/rawIngredients', rawIngredentsRoutes);
app.use(verifyToken);  // Usa il middleware qui

io.on('connection', (socket) => {
  console.log('Nuova connessione socket:', socket.id);
  let token = socket.handshake.headers.authorization.replace("Bearer ", "");
  getUsernameFromJWT(token, (err, user) => {
    if (user) {
      let username = user.username;
      socketsByUsername[username] = socket;

      socket.on('test', (data) => {
        console.log("message: " + JSON.stringify(data));
      });

      socket.on('sendNotification', (data) => {
        let username = data.username;
        let userSocket = socketsByUsername[username];
        if (userSocket) userSocket.emit('notification', data);
      });

      socket.on('messageSent', async (data) => {
        const receivers = await User.find({ "ruolo": "amministratore" }).lean();
        const sender = await getUserByUsername(data.from);
        let to = data.to;

        if (sender.ruolo == 'amministratore') {
          let userSocket = socketsByUsername[to];
          if (userSocket) {
            data.to = { "username": to };
            data.from = { "username": 'amministrazione' };
            userSocket.emit('newMessage', data);
          }
        }

        receivers.forEach(receiver => {
          if (receiver.username != sender.username) {
            let userSocket = socketsByUsername[receiver.username];
            if (userSocket) {
              data.to = { "username": receiver.username };
              data.from = { "username": sender.ruolo == 'amministratore' ? 'amministrazione' : username };
              userSocket.emit('newMessage', data);
            }
          }
        });

        const savedMessage = await createChat(username, to, data.content);
        newMessages[username + "|" + to] = true;
      });

      socket.on('chatDisplayed', (data) => {
        let nmk = data.remoteUser + "|" + data.currentUser;
        newMessages[nmk] = false;
      });
    }
  });
});

server.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});

module.exports = { app, server, io };

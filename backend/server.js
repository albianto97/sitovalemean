const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const config = require('./config');
const { verifyToken, getUsernameFromJWT } = require('./middlewares/token');

const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const { getUserByUsername } = require("./controllers/user.controller");
const User = require("./models/user");

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());


connectDB();

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);

app.use(verifyToken);  // Usa il middleware qui


server.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});

module.exports = { app, server };

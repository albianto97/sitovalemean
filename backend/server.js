const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const express = require('express');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  // Consenti l'accesso da qualsiasi origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Consenti i metodi HTTP specifici
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Consenti determinati header nella richiesta
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Consentire i cookie (se necessario)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();
});
const port = 3000;
connectDB();
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

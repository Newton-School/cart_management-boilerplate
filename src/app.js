const express = require('express');
const app = express();

const productRoutes = require('../routes/productRoutes');
const userRoutes = require('../routes/userRoutes');

app.use(express.json());

app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);

module.exports = app;

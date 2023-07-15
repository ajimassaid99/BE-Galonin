const express = require('express');
const app = express();
const loginRouter = require('./login'); 
const userRouter = require('./user'); 
const registerRouter = require('./register'); // Import route handler untuk user
const productRouter = require('./products'); // Import route handler untuk product
const orderRouter = require('./order');
const deleveryRouter = require('./delevery');
const cartRouter = require('./cart');
const imageRouter = require('./imagePayment.js');
// Middleware untuk mengizinkan Express.js membaca body dari permintaan dalam bentuk JSON
app.use(express.json());

// Menggunakan route handler untuk login pada URL /api/user
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/user/detail', userRouter);
// Menggunakan route handler untuk product pada URL /api/product
app.use('/api/products', productRouter);

app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/image', imageRouter);
app.use('/api/delevery', deleveryRouter);

// Menjalankan server pada port yang telah ditentukan
app.listen(4000, () => {
  console.log('Server berjalan pada port 3000');
});

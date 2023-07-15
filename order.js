const express = require('express');
const app = express();
const connection = require('./db'); // Import koneksi basis data MySQL
const router = express.Router();
// Mengambil data order
router.get('', (req, res) => {
  const userid = req.query.userid; // assuming userid is passed as a query parameter
  const query = `
    SELECT orders.*, GROUP_CONCAT(order_items.product_id, ':', order_items.amount) AS order_items
    FROM orders
    LEFT JOIN order_items ON orders.order_id = order_items.order_id
    WHERE user_id = '${userid}'
    GROUP BY orders.order_id 
    ORDER BY orders.order_id DESC
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Gagal mengambil data order:', error);
      res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data order.' });
    } else {
      // Parse the order items data into an array of objects
      const orders = results.map(order => ({
        order_id: order.order_id,
        user_id: order.user_id,
        total_pay: order.total_pay,
        status: order.status,
        order_items: order.order_items
          ? order.order_items.split(',').map(order_item => {
              const [product_id, amount] = order_item.split(':');
              return { product_id, amount: parseInt(amount) };
            })
          : []
      }));
      res.json(orders);
    }
  });
});


  // Menambahkan order baru
  router.post('', (req, res) => {
    const { user_id, total_pay, status, order_items } = req.body;
    const orderQuery = 'INSERT INTO orders (user_id, total_pay, status) VALUES (?, ?, ?)';
    connection.query(orderQuery, [user_id, total_pay, status], (error, orderResult) => {
      if (error) {
        console.error('Gagal menambahkan order baru:', error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam menambahkan order baru.' });
      } else {
        const orderId = orderResult.insertId;
        const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, amount) VALUES ?';
        const orderItemsData = order_items.map(order_item => [orderId, order_item.product_id, order_item.amount]);
        connection.query(orderItemsQuery, [orderItemsData], (error, orderItemsResult) => {
          if (error) {
            console.error('Gagal menambahkan order items:', error);
            res.status(500).json({ error: 'Terjadi kesalahan dalam menambahkan order items.' });
          } else {
            res.json({ order_id: orderId });
          }
        });
      }
    });
  });
  
  // Mengubah status order
router.patch('/:order_id/status', (req, res) => {
  const orderId = req.params.order_id;
  const { status } = req.body;
  const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
  connection.query(query, [status, orderId], (error, result) => {
    if (error) {
      console.error('Gagal mengubah status order:', error);
      res.status(500).json({ error: 'Terjadi kesalahan dalam mengubah status order.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Order tidak ditemukan.' });
    } else {
      res.json({ message: 'Status order berhasil diubah.' });
    }
  });
});

  module.exports = router;
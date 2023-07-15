const express = require('express');
const router = express.Router();
const db = require('./db'); // Modul untuk akses database

// GET /api/cart - Mendapatkan daftar cart
router.get('/', (req, res) => {
  const user_id = req.query.user_id; // Extract the user_id parameter from the query string

  // SQL query to get the list of cart items for a specific user
  const query = `SELECT * FROM cart a LEFT JOIN products b ON a.product_id = b.product_id WHERE a.user_id = ${user_id}`;

  db.query(query, (err, results) => {
    if (err) {
      // Handle database access errors
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      // Send the cart data in JSON format
      console.log('dapat');
      res.json(results);
    }
  });
});

router.get('/byProduct', (req, res) => {
  const user_id = req.query.user_id; // Extract the user_id parameter from the query string
  const product_id = req.query.product_id;
  // SQL query to get the list of cart items for a specific user
  const query = `SELECT * FROM cart a LEFT JOIN products b ON a.product_id = b.product_id WHERE a.user_id = ${user_id} and a.product_id = ${product_id}`;

  db.query(query, (err, results) => {
    if (err) {
      // Handle database access errors
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      // Send the cart data in JSON format
      console.log('dapat');
      res.json(results);
    }
  });
});
// POST /api/cart - Menambahkan cart baru
router.post('/', (req, res) => {
  const { cart_id, user_id, product_id, amount } = req.body;

  // Query untuk menambahkan cart baru
  const query = 'INSERT INTO cart (cart_id, user_id, product_id, amount) VALUES (?, ?, ?, ?)';

  db.query(query, [cart_id, user_id, product_id, amount], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      // Mengirimkan response sukses dengan id cart yang baru ditambahkan
      res.status(201).json({ cart_id: result.insertId, user_id, product_id, amount });
    }
  });
});

// PUT /api/cart/:id - Mengubah informasi cart berdasarkan ID cart
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, product_id, amount } = req.body;

  // Query untuk mengubah informasi cart berdasarkan ID cart
  const query = 'UPDATE cart SET user_id = ?, product_id = ?, amount = ? WHERE cart_id = ?';

  db.query(query, [user_id, product_id, amount, id], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      if (result.affectedRows === 0) {
        // Mengirimkan response error jika ID cart tidak ditemukan
        res.status(404).json({ error: 'Cart tidak ditemukan' });
      } else {
        // Mengirimkan response sukses dengan ID cart yang diubah
        res.json({ cart_id: id, user_id, product_id, amount });
      }
    }
  });
});

// PUT /api/cart - Menambah jumlah amount pada cart
router.patch('/increment', (req, res) => {
  const { user_id, product_id } = req.body;

  // Query untuk menambah jumlah amount pada cart
  const query = 'UPDATE cart SET amount = amount + 1 WHERE user_id = ? AND product_id = ?';

  db.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      if (result.affectedRows === 0) {
        // Mengirimkan response error jika user_id atau product_id tidak ditemukan pada cart
        res.status(404).json({ error: 'Data cart tidak ditemukan' });
      } else {
        // Mengirimkan response sukses dengan user_id dan product_id yang diubah
        res.json({ message: `Jumlah amount pada cart dengan user_id ${user_id} dan product_id ${product_id} berhasil ditambahkan` });
      }
    }
  });
});

router.patch('/decrement', (req, res) => {
  const { user_id, product_id } = req.body;

  // Query untuk menambah jumlah amount pada cart
  const query = 'UPDATE cart SET amount = CASE WHEN amount <= 1 THEN 1 ELSE amount - 1 END WHERE user_id = ? AND product_id = ?';

  db.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      if (result.affectedRows === 0) {
        // Mengirimkan response error jika user_id atau product_id tidak ditemukan pada cart
        console.log(user_id);
        res.status(404).json({ error: 'Data cart tidak ditemukan' });
      } else {
        // Mengirimkan response sukses dengan user_id dan product_id yang diubah
        res.json({ message: `Jumlah amount pada cart dengan user_id ${user_id} dan product_id ${product_id} berhasil diKurangi` });
      }
    }
  });
});
router.delete('/:cart_id', (req, res) => {
    const { cart_id } = req.params;
  
    // Query untuk menghapus data cart berdasarkan cart_id
    const query = 'DELETE FROM cart WHERE cart_id = ?';
  
    db.query(query, [cart_id], (err, result) => {
      if (err) {
        // Menghandle error ketika mengakses database
        console.error(err);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
      } else {
        if (result.affectedRows === 0) {
          // Mengirimkan response error jika cart_id tidak ditemukan
          res.status(404).json({ error: 'Data cart tidak ditemukan' });
        } else {
          // Mengirimkan response sukses dengan cart_id yang dihapus
          res.json({ message: `Data cart dengan cart_id ${cart_id} berhasil dihapus` });
        }
      }
    });
  });

  router.delete('/all/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Query untuk menghapus data di tabel Cart berdasarkan user ID
    const query = `DELETE FROM cart WHERE user_id = ${userId}`;
    
    db.query(query, (err, result) => {
      if (err) {
        // Menghandle error ketika mengakses database
        console.error(err);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
      } else {
        // Mengirimkan response sukses dengan jumlah row yang dihapus
        res.json({ message: `Berhasil menghapus ${result.affectedRows} data di tabel Cart untuk user ID ${userId}` });
      }
    });
  });
  
  
  
module.exports = router;

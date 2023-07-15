const express = require('express');
const router = express.Router();
const db = require('./db'); // Modul untuk akses database

// GET /api/delivery - Mendapatkan daftar pengiriman
router.get('/', (req, res) => {
  // Query untuk mendapatkan daftar pengiriman
  const query = 'SELECT * FROM delivery';

  db.query(query, (err, results) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      // Mengirimkan data pengiriman dalam format JSON
      res.json(results);
    }
  });
});

// POST /api/delivery - Menambahkan pengiriman baru
router.post('/', (req, res) => {
  const { order_id, status } = req.body;

  // Query untuk menambahkan pengiriman baru
  const query = 'INSERT INTO delivery (order_id, status) VALUES (?, ?)';

  db.query(query, [order_id, status], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      // Mengirimkan response sukses dengan id pengiriman yang baru ditambahkan
      res.status(201).json({ delivery_id: result.insertId, order_id, status });
    }
  });
});

// PUT /api/delivery/:id - Mengubah status pengiriman berdasarkan ID pengiriman
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Query untuk mengubah status pengiriman berdasarkan ID pengiriman
  const query = 'UPDATE delivery SET status = ? WHERE delivery_id = ?';

  db.query(query, [status, id], (err, result) => {
    if (err) {
      // Menghandle error ketika mengakses database
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengakses database' });
    } else {
      if (result.affectedRows === 0) {
        // Mengirimkan response error jika ID pengiriman tidak ditemukan
        res.status(404).json({ error: 'Pengiriman tidak ditemukan' });
      } else {
        // Mengirimkan response sukses dengan ID pengiriman yang diubah
        res.json({ delivery_id: id, status });
      }
    }
  });
});

module.exports = router;

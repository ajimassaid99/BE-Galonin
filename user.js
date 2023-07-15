const express = require('express');
const connection = require('./db'); // Import koneksi basis data MySQL
const router = express.Router();

// Middleware untuk mengizinkan Express.js membaca body dari permintaan dalam bentuk JSON
router.use(express.json());

// Definisi endpoint untuk permintaan GET user by id
router.get('/:userId', (req, res) => {
  // Mengambil data userId dari parameter URL
  const { userId } = req.params;

  // Mengecek apakah userId ada di basis data
  connection.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error saat mengambil data user:', error);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam mengambil data user.' });
    } else {
      if (results.length > 0) {
        // Jika user ditemukan, mengirimkan data user sebagai respons
        const user = results[0];
        res.json({ status: 'success', data: user });
      } else {
        // Jika user tidak ditemukan, memberikan respons bahwa user tidak ditemukan
        res.json({ status: 'error', message: 'User tidak ditemukan.' });
      }
    }
  });
});

module.exports = router;

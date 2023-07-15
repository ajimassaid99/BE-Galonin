const express = require('express');
const bcrypt = require('bcryptjs'); // Update bcrypt to bcryptjs
const jwt = require('jsonwebtoken');
const connection = require('./db'); // Import koneksi basis data MySQL
const router = express.Router();

// Middleware untuk mengizinkan Express.js membaca body dari permintaan dalam bentuk JSON
router.use(express.json());

// Definisi endpoint untuk permintaan POST login
router.post('/', (req, res) => { 
  // Mengambil data email dan password dari body permintaan
  const { email, password } = req.body;

  // Mengecek apakah email ada di basis data
  connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.log('gagal post');
      console.error('Error saat memeriksa email:', error);
      res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam memeriksa email.' });
    } else {
      if (results.length > 0) {
        // Jika email ditemukan, membandingkan password yang dimasukkan dengan yang ada di basis data
        const user = results[0];
        // Membandingkan password dengan plain text password menggunakan bcryptjs.compare
        
            if (user.password == password) {
              // Jika password cocok, menghasilkan token JWT
              console.log('berhasil');
              res.json({ status: 'success', message: 'Login berhasil.', data: {'userId': user.user_id}
            });
            } else {
              // Jika password salah, memberikan respons bahwa login gagal
              console.log('gagal Pass');
              res.json({ status: 'error', message: 'Email atau password salah.'});
            }
      } else {
        // Jika email tidak ditemukan, memberikan respons bahwa login gagal
        console.log('null');
        res.json({ status: 'error', message: 'Email atau password salah.'});
      }
    }
  });
});

module.exports = router;

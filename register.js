const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const connection = require('./db'); // Import koneksi basis data MySQL
const router = express.Router();


// Middleware untuk mengizinkan Express.js membaca body dari permintaan dalam bentuk JSON
router.use(express.json());

// Definisi endpoint untuk permintaan POST register pengguna
router.post('', (req, res) => {
    // Mengambil data pengguna dari body permintaan
    const { nama, email, password, role, alamat,no_telp, } = req.body;

    // Mengenkripsi password menggunakan bcrypt
            // Mengecek apakah email sudah ada di basis data
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                    console.error('Error saat memeriksa email:', error);
                    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam memeriksa email.' });
                } else {
                    if (results.length > 0) {
                        // Jika email sudah ada, memberikan respons bahwa email sudah terdaftar
                        res.json({ status: 'error', message: 'Email sudah terdaftar.' });
                    } else {
                        // Jika email belum ada, menyimpan data pengguna ke basis data
                        const newUser = { nama, email, password, role, alamat,no_telp }; // Menggunakan password yang telah dienkripsi
                        connection.query('INSERT INTO users SET ?', newUser, (error) => {
                            if (error) {
                                console.error('Error saat menyimpan data pengguna:', error);
                                res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam menyimpan data pengguna.' });
                            } else {
                                // Memberikan respons bahwa data pengguna telah diterima dan diproses
                                res.json({ status: 'success', message: 'Registrasi pengguna berhasil.' });
                            }
                        });
                    }
                }
            });
        }
    );

// Definisi endpoint untuk permintaan GET pengguna
router.get('/', (req, res) => {
    // Query SQL untuk mengambil data nama, email, role, dan alamat pengguna
    const query = 'SELECT nama, email, role, alamat FROM users';

    // Menjalankan query dan mengirimkan respons kepada pengguna
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error mengambil data pengguna:', error);
            res.status(500).json({ status: 'error', message: 'Gagal mengambil data pengguna.' });
        } else {
            res.json({ status: 'success', message: 'Data pengguna ditemukan.', data: results });
        }
    });
});

module.exports = router;

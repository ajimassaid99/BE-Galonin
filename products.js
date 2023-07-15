const express = require('express');
const router = express.Router();
const connection = require('./db'); // Import koneksi basis data MySQL

router.get('', (req, res) => {
    // Query to fetch all products from the database
    connection.query('SELECT * FROM products order by size DESC ', (error, results) => {
      if (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch products.' });
      } else {
        // Send the fetched products as response
        res.json({ status: 'success', data: results });
      }
    });
  });

  router.get('/:productId', (req, res) => {
    const { productId } = req.params;
    
    // Query untuk mengambil produk dengan ID yang sesuai dari basis data
    connection.query('SELECT * FROM products WHERE product_id = ?', [productId], (error, results) => {
      if (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch product.' });
      } else {
        if (results.length === 0) {
          // Jika produk tidak ditemukan, memberikan respons bahwa produk tidak ditemukan
          res.status(404).json({ status: 'error', message: 'Product not found.' });
        } else {
          // Jika produk ditemukan, mengirimkan data produk sebagai respons
          res.json({ status: 'success', data: results[0] });
        }
      }
    });
  });
  

router.post('', (req, res) => {
    // Mengambil data produk dari body permintaan
    const { imageUrl, brand, size } = req.body;
  
    // Mengecek apakah produk dengan URL gambar yang sama sudah ada di basis data
    connection.query('SELECT * FROM products WHERE imageUrl = ?', [imageUrl], (error, results) => {
      if (error) {
        console.error('Error saat memeriksa produk:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam memeriksa produk.' });
      } else {
        if (results.length > 0) {
          // Jika produk dengan URL gambar yang sama sudah ada, memberikan respons bahwa produk sudah terdaftar
          res.json({ status: 'error', message: 'Produk sudah terdaftar.' });
        } else {
          // Jika produk belum ada, menyimpan data produk ke basis data
          const newProduct = { imageUrl, brand, size };
          connection.query('INSERT INTO products SET ?', newProduct, (error) => {
            if (error) {
              console.error('Error saat menyimpan data produk:', error);
              res.status(500).json({ status: 'error', message: 'Terjadi kesalahan dalam menyimpan data produk.' });
            } else {
              // Memberikan respons bahwa data produk telah diterima dan diproses
              res.json({ status: 'success', message: 'Data produk telah diterima dan diproses.' });
            }
          });
        }
      }
    });
  });

  module.exports = router;
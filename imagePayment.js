const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Menentukan direktori penyimpanan gambar

const app = express();

// Mendefinisikan rute POST untuk mengunggah gambar
app.post('/payment/images', upload.single('image'), (req, res) => {
  const order_id = req.body.order_id;
  const image_url = req.file.path;
  const uploaded_at = new Date();

  // Lakukan penyimpanan data gambar ke tabel payment_images di database
  // Tulis kode untuk menyimpan data gambar ke database sesuai dengan logika aplikasi Anda

  res.status(200).json({ message: 'Gambar berhasil diunggah' });
});

// Menjalankan server
app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});

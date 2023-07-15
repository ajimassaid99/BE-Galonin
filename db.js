const mysql = require('mysql');

// Koneksi basis data MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Nama host MySQL
    user: 'root', // Nama pengguna MySQL
    password: '', // Kata sandi MySQL
    database: 'db_galonin' // Nama basis data MySQL
  });
  
  // Membuka koneksi ke MySQL
  connection.connect((error) => {
    if (error) {
      console.error('Error koneksi basis data:', error);
    } else {
      console.log('Koneksi basis data berhasil!');
    }
  });

module.exports = connection;

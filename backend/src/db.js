// src/db.js — Koneksi database
const mysql = require('mysql2')

const db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',           // password MySQL
  database : 'buku_ada_db'
})

db.connect(err => {
  if (err) {
    console.error('Gagal konek ke database:', err.message)
    return
  }
  console.log('Terhubung ke database MySQL!')
})

module.exports = db

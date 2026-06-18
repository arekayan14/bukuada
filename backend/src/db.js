// src/db.js — Koneksi database
require('dotenv').config()
const mysql = require('mysql2')

const db = mysql.createConnection({
  host     : process.env.DB_HOST || '127.0.0.1',
  user     : process.env.DB_USER || 'root',
  password : process.env.DB_PASSWORD || '',    // <-- Password dari file .env
  database : process.env.DB_NAME || 'buku_ada_db'
})

db.connect(err => {
  if (err) {
    console.error('Gagal konek ke database:', err.message)
    return
  }
  console.log('Terhubung ke database MySQL!')
})

module.exports = db
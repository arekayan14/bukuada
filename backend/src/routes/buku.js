// routes/buku.js
const express = require('express')
const router  = express.Router()
const db      = require('../db')

// Ambil semua buku
router.get('/', (req, res) => {
  db.query('SELECT * FROM buku ORDER BY id ASC', (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(hasil)
  })
})

// Tambah buku baru
router.post('/', (req, res) => {
  const { judul, rak, gambar, stok } = req.body
  if (!judul || !rak || !gambar)
    return res.status(400).json({ error: 'Judul, rak, dan gambar wajib diisi!' })

  db.query(
    'INSERT INTO buku (judul, rak, gambar, stok, dipinjam) VALUES (?, ?, ?, ?, 0)',
    [judul, rak, gambar, stok || 1],
    (err, hasil) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Buku berhasil ditambahkan!', id: hasil.insertId })
    }
  )
})

// Hapus buku
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM buku WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ message: 'Buku berhasil dihapus!' })
  })
})

module.exports = router

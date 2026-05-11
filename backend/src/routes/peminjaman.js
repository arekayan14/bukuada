const express = require('express')
const router  = express.Router()
const db      = require('../db')
 
// Helper: cari user_id dari nama
function getUserId(nama, callback) {
  db.query('SELECT id FROM users WHERE nama = ?', [nama], (err, rows) => {
    if (err) return callback(err)
    if (!rows.length) return callback(new Error('User tidak ditemukan!'))
    callback(null, rows[0].id)
  })
}
 
// POST /api/peminjaman/pinjam
router.post('/pinjam', (req, res) => {
  const { bukuId, namaUser } = req.body
 
  // Cek stok buku dulu
  db.query('SELECT * FROM buku WHERE id = ?', [bukuId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!rows.length) return res.status(404).json({ error: 'Buku tidak ditemukan!' })
    const buku = rows[0]
    if ((buku.stok - buku.dipinjam) <= 0) return res.status(400).json({ error: 'Stok buku habis!' })
 
    // Cari user_id berdasarkan nama
    getUserId(namaUser, (err2, userId) => {
      if (err2) return res.status(404).json({ error: err2.message })
 
      db.query('INSERT INTO peminjaman (user_id, buku_id) VALUES (?, ?)', [userId, bukuId], err3 => {
        if (err3) return res.status(500).json({ error: err3.message })
        db.query('UPDATE buku SET dipinjam = dipinjam + 1 WHERE id = ?', [bukuId], err4 => {
          if (err4) return res.status(500).json({ error: err4.message })
          res.json({ message: 'Berhasil meminjam buku!' })
        })
      })
    })
  })
})
 
// POST /api/peminjaman/kembalikan (user)
router.post('/kembalikan', (req, res) => {
  const { bukuId, namaUser } = req.body
 
  getUserId(namaUser, (err, userId) => {
    if (err) return res.status(404).json({ error: err.message })
 
    const sql = "SELECT * FROM peminjaman WHERE user_id = ? AND buku_id = ? AND status = 'dipinjam' LIMIT 1"
    db.query(sql, [userId, bukuId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message })
      if (!rows.length) return res.status(404).json({ error: 'Data peminjaman tidak ditemukan!' })
 
      db.query("UPDATE peminjaman SET status = 'dikembalikan', tanggal_kembali = NOW() WHERE id = ?", [rows[0].id], err3 => {
        if (err3) return res.status(500).json({ error: err3.message })
        db.query('UPDATE buku SET dipinjam = dipinjam - 1 WHERE id = ?', [bukuId], err4 => {
          if (err4) return res.status(500).json({ error: err4.message })
          res.json({ message: 'Buku berhasil dikembalikan!' })
        })
      })
    })
  })
})
 
// POST /api/peminjaman/kembalikan-admin (by id peminjaman)
router.post('/kembalikan-admin', (req, res) => {
  const { pinjamId } = req.body
  db.query('SELECT * FROM peminjaman WHERE id = ?', [pinjamId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!rows.length) return res.status(404).json({ error: 'Data tidak ditemukan!' })
    if (rows[0].status === 'dikembalikan') return res.status(400).json({ error: 'Buku sudah dikembalikan!' })
 
    db.query("UPDATE peminjaman SET status = 'dikembalikan', tanggal_kembali = NOW() WHERE id = ?", [pinjamId], err2 => {
      if (err2) return res.status(500).json({ error: err2.message })
      db.query('UPDATE buku SET dipinjam = dipinjam - 1 WHERE id = ?', [rows[0].buku_id], err3 => {
        if (err3) return res.status(500).json({ error: err3.message })
        res.json({ message: 'Buku berhasil dikembalikan!' })
      })
    })
  })
})
 
// GET /api/peminjaman/user/:nama — pinjaman aktif milik user
router.get('/user/:nama', (req, res) => {
  getUserId(req.params.nama, (err, userId) => {
    if (err) return res.status(404).json({ error: err.message })
 
    const sql = `
      SELECT p.id, p.buku_id, b.judul, b.rak, b.gambar, b.stok, b.dipinjam,
             p.status, p.tanggal_pinjam
      FROM peminjaman p
      JOIN buku b ON p.buku_id = b.id
      WHERE p.user_id = ? AND p.status = 'dipinjam'
      ORDER BY p.tanggal_pinjam DESC
    `
    db.query(sql, [userId], (err2, hasil) => {
      if (err2) return res.status(500).json({ error: err2.message })
      res.json(hasil)
    })
  })
})
 
// GET /api/peminjaman — semua riwayat (admin)
router.get('/', (req, res) => {
  const sql = `
    SELECT p.id, u.nama AS nama_user, b.judul, b.rak, p.status,
           p.tanggal_pinjam, p.tanggal_kembali,
           u.no_hp, u.no_ktp
    FROM peminjaman p
    JOIN buku b ON p.buku_id = b.id
    JOIN users u ON p.user_id = u.id
    ORDER BY p.tanggal_pinjam DESC
  `
  db.query(sql, (err, hasil) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(hasil)
  })
})
 
module.exports = router
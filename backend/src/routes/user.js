const express = require('express')
const router  = express.Router()
const db      = require('../db')

// LOGIN — cek berdasarkan no_hp (user & admin sekaligus)
// Return: { role: 'admin' | 'user' | null, user: {...} | null }
router.post('/login', (req, res) => {
  const { no_hp } = req.body
  if (!no_hp) return res.status(400).json({ error: 'No HP wajib diisi!' })

  // Cek apakah admin
  if (no_hp === '00000') {
    return res.json({ role: 'admin', user: { nama: 'Admin', no_hp: '00000' } })
  }

  // Cek user biasa
  db.query('SELECT * FROM users WHERE no_hp = ?', [no_hp.trim()], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length === 0) return res.json({ role: null }) // belum terdaftar
    res.json({ role: 'user', user: rows[0] })
  })
})

// DAFTAR user baru (nama + no_hp + no_ktp)
router.post('/daftar', (req, res) => {
  const { nama, no_hp, no_ktp } = req.body
  if (!nama || !no_hp || !no_ktp)
    return res.status(400).json({ error: 'Nama, No HP, dan No KTP wajib diisi!' })

  // Cek duplikat no_hp
  db.query('SELECT id FROM users WHERE no_hp = ?', [no_hp], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    if (rows.length > 0) return res.status(400).json({ error: 'No HP sudah terdaftar!' })

    db.query('INSERT INTO users (nama, no_hp, no_ktp) VALUES (?, ?, ?)', [nama, no_hp, no_ktp], (err2, hasil) => {
      if (err2) return res.status(500).json({ error: err2.message })
      res.json({ message: 'Berhasil didaftarkan!', id: hasil.insertId })
    })
  })
})

module.exports = router

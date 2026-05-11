// api/index.js — semua request ke backend terpusat di sini
// Disesuaikan dengan routing backend: /api/peminjaman/...

const BASE_URL = 'http://76.13.23.214:5000/api'

async function request(url, options = {}) {
  const res  = await fetch(BASE_URL + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
  return data
}

// ── USER ──────────────────────────────────────────────────
export const loginUser  = (no_hp)               => request('/user/login',  { method: 'POST', body: JSON.stringify({ no_hp }) })
export const daftarUser = (nama, no_hp, no_ktp) => request('/user/daftar', { method: 'POST', body: JSON.stringify({ nama, no_hp, no_ktp }) })

// ── BUKU ──────────────────────────────────────────────────
export const getBuku    = ()     => request('/buku')
export const tambahBuku = (data) => request('/buku', { method: 'POST', body: JSON.stringify(data) })
export const hapusBuku  = (id)   => request(`/buku/${id}`, { method: 'DELETE' })

// ── PEMINJAMAN ─────────────────────────────────────────────
export const pinjamBuku      = (bukuId, namaUser) => request('/peminjaman/pinjam',           { method: 'POST', body: JSON.stringify({ bukuId, namaUser }) })
export const kembalikanBuku  = (bukuId, namaUser) => request('/peminjaman/kembalikan',       { method: 'POST', body: JSON.stringify({ bukuId, namaUser }) })
export const kembalikanAdmin = (pinjamId)         => request('/peminjaman/kembalikan-admin', { method: 'POST', body: JSON.stringify({ pinjamId }) })
export const getPinjamanUser = (nama)             => request(`/peminjaman/user/${encodeURIComponent(nama)}`)
export const getRiwayat      = ()                 => request('/peminjaman')

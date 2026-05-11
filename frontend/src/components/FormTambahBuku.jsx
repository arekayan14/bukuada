import { useState } from 'react'

export default function FormTambahBuku({ onTambah }) {
  const [judul,  setJudul]  = useState('')
  const [rak,    setRak]    = useState('')
  const [gambar, setGambar] = useState('')
  const [stok,   setStok]   = useState(1)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!judul.trim() || !rak.trim() || !gambar.trim()) {
      alert('Lengkapi semua data buku!'); return
    }
    if (stok < 1) { alert('Jumlah stok minimal 1!'); return }
    setLoading(true)
    try {
      await onTambah({ judul, rak, gambar, stok })
      setJudul(''); setRak(''); setGambar(''); setStok(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Tambah Buku Baru</h2>
      <div className="space-y-4">
        <input
          type="text" placeholder="Judul Buku" value={judul}
          onChange={e => setJudul(e.target.value)}
          className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text" placeholder="Nomor Rak (Contoh: A-1)" value={rak}
          onChange={e => setRak(e.target.value)}
          className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text" placeholder="Link URL Gambar Sampul" value={gambar}
          onChange={e => setGambar(e.target.value)}
          className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="number" placeholder="Jumlah Stok" value={stok} min={1}
          onChange={e => setStok(parseInt(e.target.value) || 1)}
          className="w-full p-2 border rounded-md outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-800 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-60"
        >
          {loading ? 'Menyimpan...' : 'Simpan ke Katalog'}
        </button>
      </div>
    </div>
  )
}

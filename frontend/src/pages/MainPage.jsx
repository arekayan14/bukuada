import { useState, useEffect } from 'react'
import { getBuku, pinjamBuku, kembalikanBuku, getPinjamanUser, hapusBuku } from '../api'
import KartuBuku      from '../components/KartuBuku'
import PanelKeranjang from '../components/PanelKeranjang'
import BukuSaya       from '../components/BukuSaya'
import ToastKonfirmasi from '../components/ToastKonfirmasi'
import logoBuku from '../assets/book.png'
import logoTas from '../assets/tas.png'
import logoKeluar from '../assets/power-button.png'


export default function MainPage({ user, modeAdmin, onKembaliAdmin, onLogout, tampilToast }) {
  const [daftarBuku, setDaftarBuku]   = useState([])
  const [keranjang, setKeranjang]     = useState([])
  const [pinjamUser, setPinjamUser]   = useState([])
  const [bukuSaya, setBukuSaya]       = useState([])
  const [tab, setTab]                 = useState('katalog')
  const [cari, setCari]               = useState('')
  const [showKeranjang, setShowKeranjang] = useState(false)
  const [konfirmasiKeluar, setKonfirmasiKeluar] = useState(false)

  useEffect(() => {
    loadBuku()
    if (user) loadPinjamanAktif()
  }, [])

  async function loadBuku() {
    try {
      const data = await getBuku()
      setDaftarBuku(data)
    } catch { alert('Gagal memuat data buku.') }
  }

  async function loadPinjamanAktif() {
    try {
      const data = await getPinjamanUser(user.nama)
      setPinjamUser(data.map(p => p.buku_id))
      setBukuSaya(data)
    } catch (err) { console.error(err) }
  }

  async function handlePinjam(bukuId) {
    try {
      await pinjamBuku(bukuId, user.nama)
      setDaftarBuku(prev => prev.map(b => b.id === bukuId ? { ...b, dipinjam: b.dipinjam + 1 } : b))
      setPinjamUser(prev => [...prev, bukuId])
      setKeranjang(prev => prev.filter(b => b.id !== bukuId))
      await loadPinjamanAktif()
      tampilToast('Berhasil meminjam buku!')
    } catch (err) { alert(err.message) }
  }

  async function handleKembalikan(bukuId) {
    if (!window.confirm('Kembalikan buku ini?')) return
    try {
      await kembalikanBuku(bukuId, user.nama)
      setDaftarBuku(prev => prev.map(b => b.id === bukuId ? { ...b, dipinjam: Math.max(0, b.dipinjam - 1) } : b))
      setPinjamUser(prev => prev.filter(id => id !== bukuId))
      await loadPinjamanAktif()
      tampilToast('Buku berhasil dikembalikan!')
    } catch (err) { alert(err.message) }
  }

  async function handleHapusBuku(bukuId) {
    const buku = daftarBuku.find(b => b.id === bukuId)
    if (!window.confirm(`Hapus buku "${buku?.judul}" dari katalog?`)) return
    try {
      await hapusBuku(bukuId)
      setDaftarBuku(prev => prev.filter(b => b.id !== bukuId))
      tampilToast('Buku berhasil dihapus!')
    } catch (err) { alert(err.message) }
  }

  function tambahKeranjang(buku) {
    if (keranjang.find(b => b.id === buku.id)) { alert('Buku sudah di keranjang!'); return }
    setKeranjang(prev => [...prev, buku])
    tampilToast(`"${buku.judul}" ditambahkan ke keranjang!`)
  }

  async function pinjamSemua() {
    let berhasil = 0
    for (const item of keranjang) {
      const buku = daftarBuku.find(b => b.id === item.id)
      if (!buku || (buku.stok - buku.dipinjam) <= 0 || pinjamUser.includes(buku.id)) continue
      try { await pinjamBuku(buku.id, user.nama); berhasil++ } catch {}
    }
    setKeranjang([])
    setShowKeranjang(false)
    await loadBuku()
    await loadPinjamanAktif()
    tampilToast(`${berhasil} buku berhasil dipinjam!`)
  }

  const bukuTerfilter = daftarBuku.filter(b => b.judul.toLowerCase().includes(cari.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center relative">
          
          {/* Logo Kiri */}
          <div className="flex items-center gap-3">
            <img 
              src={logoBuku} 
              alt="Logo Buku" 
              className="w-10 h-10 object-contain" 
            />
            <h1 className="text-blue-600 font-bold text-xl hidden md:block">Buku Ada</h1>
          </div>

          {/* Sapaan User */}
          {user && (
            <div className="absolute left-1/2 -translate-x-1/2 text-sm text-gray-700">
              <span>Halo, <span className="font-bold text-blue-600">{user.nama}</span> 👋</span>
            </div>
          )}

          {/* Sisi Kanan: Tombol-tombol */}
          <div className="flex items-center gap-2">
            {modeAdmin ? (
              <button onClick={onKembaliAdmin} className="flex items-center gap-2 text-xs bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-600 transition">
                <img 
                  src={logoBuku} 
                  alt="Logo" 
                  className="w-4 h-4 object-contain" 
                />
                Panel Admin
              </button>
            ) : (
              <button onClick={() => setShowKeranjang(true)} className="relative flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition">
                <img 
                  src={logoTas} 
                  alt="Logo Tas" 
                  className="w-4 h-4 object-contain" 
                />
                Keranjang
                {keranjang.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {keranjang.length}
                  </span>
                )}
              </button>
            )}
            
            {user && !modeAdmin && (
              <button
                onClick={() => setKonfirmasiKeluar(true)}
                className="flex items-center gap-2 text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100 transition"
              >
                <img 
                  src={logoKeluar} 
                  alt="Logo Keluar" 
                  className="w-4 h-4 object-contain" 
                />
                Keluar
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Tab user */}
      {!modeAdmin && (
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-2">
          <div className="flex bg-white rounded-xl shadow-sm border mb-4 overflow-hidden">
            <button onClick={() => setTab('katalog')} className={`flex-1 py-3 font-bold text-sm transition ${tab === 'katalog' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              📚 Katalog Buku
            </button>
            <button onClick={() => { setTab('bukuSaya'); loadPinjamanAktif() }} className={`flex-1 py-3 font-bold text-sm transition relative ${tab === 'bukuSaya' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              📖 Buku Saya
              {bukuSaya.length > 0 && (
                <span className="absolute top-2 right-4 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full inline-flex items-center justify-center">
                  {bukuSaya.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Katalog Buku */}
      {(tab === 'katalog' || modeAdmin) && (
        <>
          <div className="max-w-4xl mx-auto px-6 pb-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <label className="block text-xs font-bold text-gray-400 mb-1">Cari Buku</label>
              <input type="text" placeholder="Masukan judul buku..." value={cari} onChange={e => setCari(e.target.value)} className="w-full rounded-md outline-gray-100 p-2 text-lg" />
            </div>
          </div>
          <div className="px-9 pb-2"><h3 className="font-bold text-gray-800 mb-3">Koleksi Buku</h3></div>
          <div className="px-9 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {bukuTerfilter.length === 0
                ? <div className="text-center text-gray-400 py-12 w-full">Buku tidak ditemukan.</div>
                : bukuTerfilter.map(buku => (
                    <KartuBuku
                      key={buku.id}
                      buku={buku}
                      modeAdmin={modeAdmin}
                      dipinjamUser={pinjamUser.includes(buku.id)}
                      diKeranjang={!!keranjang.find(b => b.id === buku.id)}
                      onPinjam={handlePinjam}
                      onKembalikan={handleKembalikan}
                      onKeranjang={tambahKeranjang}
                      onHapus={handleHapusBuku}
                    />
                  ))
              }
            </div>
          </div>
        </>
      )}

      {/* Buku Saya */}
      {tab === 'bukuSaya' && !modeAdmin && (
        <BukuSaya listPinjaman={bukuSaya} onKembalikan={handleKembalikan} />
      )}

      <PanelKeranjang
        show={showKeranjang} // Kirim status tampil/tidak
        keranjang={keranjang}
        onHapus={id => setKeranjang(prev => prev.filter(b => b.id !== id))}
        onPinjamSemua={pinjamSemua}
        onTutup={() => setShowKeranjang(false)}
      />

      {/* Toast konfirmasi keluar */}
      {konfirmasiKeluar && (
        <ToastKonfirmasi
          pesan="Yakin mau keluar?"
          onYa={() => { setKonfirmasiKeluar(false); onLogout() }}
          onTidak={() => setKonfirmasiKeluar(false)}
        />
      )}
    </div>
  )
}
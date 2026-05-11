import { useState, useEffect } from 'react'
import { tambahBuku, getRiwayat, kembalikanAdmin } from '../api'
import TabelRiwayat       from '../components/TabelRiwayat'
import FormTambahBuku     from '../components/FormTambahBuku'
import ModalGantiPassword from '../components/ModalGantiPassword'
import logoSetting from '../assets/geography.png'
import logoData from '../assets/diagram.png'
import logoTambah from '../assets/tambah.png'
import logoKatalog from '../assets/dictionary.png'
import logoKeluar from '../assets/power-button.png'

export default function AdminPage({ onLihatKatalog, onLogout, tampilToast }) {
  const [tab, setTab]           = useState('tambah')
  const [riwayat, setRiwayat]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [showGantiPass, setShowGantiPass] = useState(false)

  useEffect(() => {
    if (tab === 'riwayat') loadRiwayat()
  }, [tab])

  async function loadRiwayat() {
    setLoading(true)
    try {
      const data = await getRiwayat()
      setRiwayat(data)
    } catch {
      alert('Gagal memuat riwayat.')
    } finally {
      setLoading(false)
    }
  }

  async function handleTambahBuku(formData) {
    try {
      await tambahBuku(formData)
      tampilToast('Buku berhasil ditambahkan!')
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleKembalikanAdmin(pinjamId) {
    if (!window.confirm('Tandai buku ini sudah dikembalikan?')) return
    try {
      await kembalikanAdmin(pinjamId)
      tampilToast('Buku berhasil ditandai dikembalikan!')
      loadRiwayat()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Admin */}
      <nav className="bg-black p-4 text-white sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={logoSetting} 
              alt="Logo Setting" 
              className="w-8 h-8 object-contain " 
            />
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGantiPass(true)}
              className="text-xs bg-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
            >
              <span>🔑</span> <span className="hidden sm:inline">Ganti Password</span>
            </button>
            <button
              onClick={onLihatKatalog}
              className="bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              title="Lihat Katalog"
            >
              <img 
                src={logoKatalog} 
                alt="Logo Katalog" 
                className="w-5 h-5" 
              />
              <span className="text-xs hidden sm:inline">Katalog</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-100 transition"
            >
              <img 
                src={logoKeluar} 
                alt="Logo Keluar" 
                className="w-4 h-4 object-contain" 
              />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-6">
        {/* Tab Switcher */}
        <div className="flex bg-slate-200 rounded-xl p-1 gap-1 mb-8">
          <button
            onClick={() => setTab('tambah')}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-lg font-bold text-sm transition-all ${
              tab === 'tambah' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            <img 
              src={logoTambah} 
              alt="Logo Tambah" 
              className={`w-7 h-7 mb-1 object-contain ${tab !== 'tambah' && 'opacity-50'}`} 
            />
            Tambah Buku
          </button>
          <button
            onClick={() => setTab('riwayat')}
            className={`flex-1 flex flex-col items-center justify-center py-4 rounded-lg font-bold text-sm transition-all ${
              tab === 'riwayat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            <img 
              src={logoData} 
              alt="Logo Data" 
              className={`w-7 h-7 mb-1 object-contain ${tab !== 'riwayat' && 'opacity-50'}`} 
            />
            Data Peminjam
          </button>
        </div>

        {/* Content Panels */}
        <div className="pb-10">
          {tab === 'tambah' && (
            <FormTambahBuku onTambah={handleTambahBuku} />
          )}

          {tab === 'riwayat' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Daftar Peminjaman Aktif</h2>
                <button
                  onClick={loadRiwayat}
                  className="text-xs font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-4 py-2 rounded-xl transition-all"
                >
                  🔄 Refresh Data
                </button>
              </div>
              <TabelRiwayat
                data={riwayat}
                loading={loading}
                onKembalikan={handleKembalikanAdmin}
              />
            </div>
          )}
        </div>
      </div>

      {showGantiPass && (
        <ModalGantiPassword
          onBerhasil={() => { setShowGantiPass(false); tampilToast('Password berhasil diubah!') }}
          onBatal={() => setShowGantiPass(false)}
        />
      )}
    </div>
  )
}
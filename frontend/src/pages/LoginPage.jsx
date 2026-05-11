import { useState } from 'react'
import { loginUser } from '../api'
import logoBuku from '../assets/book.png';
import bgLogin from '../assets/bg-login.jpg';

// Password admin disimpan di sini (bisa diubah via ganti password)
export let ADMIN_PASS = 'admin123'
export function setAdminPass(p) { ADMIN_PASS = p }

export default function LoginPage({ onMasukUser, onDaftarBaru, onMasukAdmin }) {
  const [noHp, setNoHp]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleLogin() {
    setError('')
    
    // VALIDASI NOMOR HP (Tambahkan di sini)
    const phoneRegex = /^08[0-9]{8,11}$/;

    if (!noHp.trim()) { setError('No HP wajib diisi!'); return }
    
    // Jika bukan admin (00000), maka lakukan validasi format HP Indonesia
    if (noHp.trim() !== '00000') {
      if (!phoneRegex.test(noHp.trim())) {
        setError('Nomor HP tidak valid! Gunakan format 08xxxxxxxx');
        return;
      }
    }


    setLoading(true)
    try {
      const res = await loginUser(noHp.trim())

      // Admin — cek password
      if (res.role === 'admin') {
        if (password === ADMIN_PASS) {
          onMasukAdmin()
        } else {
          setError('Password admin salah!')
        }
        return
      }

      // User sudah terdaftar
      if (res.role === 'user') {
        onMasukUser(res.user)
        return
      }

      // Belum terdaftar — arahkan ke register
      onDaftarBaru(noHp.trim())

    } catch {
      setError('Tidak bisa terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  // Tampilkan field password hanya kalau no HP = nomor admin
  const isAdmin = noHp.trim() === '00000'

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgLogin})` }} // <-- Menerapkan gambar
    >
      {/* Overlay Gelap (Opsional: Agar form lebih menonjol) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Box Form */}
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <div className="text-5xl mb-4 flex justify-center">
          <img 
            src={logoBuku} 
            alt="Logo Buku" 
            className="w-20 h-20 object-contain" 
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Buku Ada</h2>
        <p className="text-gray-500 mb-6 text-sm">
          {isAdmin ? 'Masuk sebagai Admin' : 'Masukkan nomor HP kamu'}
        </p>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">No. HP</label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              value={noHp}
              onChange={e => { setNoHp(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && !isAdmin && handleLogin()}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isAdmin && (
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Password Admin</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold transition disabled:opacity-60 text-white ${isAdmin ? 'bg-slate-800 hover:bg-slate-700' : 'bg-purple-700 hover:bg-purple-800'}`}
          >
            {loading ? 'Memuat...' : isAdmin ? '⚙️ Masuk sebagai Admin' : 'Lanjutkan'}
          </button>

        </div>
      </div>
    </div>
  )
}

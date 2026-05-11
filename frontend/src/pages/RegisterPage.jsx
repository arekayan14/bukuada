import { useState } from 'react'
import { daftarUser } from '../api'
import logoUser from '../assets/user.png'

export default function RegisterPage({ no_hp, onBerhasil, onKembali }) {
  const [nama,  setNama]    = useState('')
  const [noKtp, setNoKtp]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleDaftar() {
  setError('');

  // 1. Validasi jika Keduanya Kosong
  if (!nama.trim() && !noKtp.trim()) {
    setError('Nama dan No KTP wajib diisi!');
    return; // Berhenti di sini
  }

  // 2. Validasi jika Nama Kosong (tapi KTP ada)
  if (!nama.trim()) {
    setError('Nama wajib diisi!');
    return;
  }

  // 3. Validasi jika No KTP Kosong (tapi Nama ada)
  if (!noKtp.trim()) {
    setError('No KTP wajib diisi!');
    return;
  }

  // 4. Validasi Panjang No KTP (Standar 16 Digit)
  if (noKtp.trim().length !== 16) {
    setError('Nomor KTP tidak valid!');
    return;
  }

  // Jika semua validasi lolos, baru jalankan loading dan API
  setLoading(true);
  try {
    await daftarUser(nama.trim(), no_hp, noKtp.trim());
    onBerhasil({ nama: nama.trim(), no_hp, no_ktp: noKtp.trim() });
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <div className="text-5xl mb-4 flex justify-center">
                  <img 
                    src={logoUser} 
                    alt="Logo User" 
                    className="w-20 h-20 object-center" 
                  />
                </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Pendaftaran</h2>
        <p className="text-gray-500 mb-1 text-sm">No. HP: <strong>{no_hp}</strong></p>
        <p className="text-gray-500 mb-6 text-sm">Lengkapi data berikut untuk mendaftar.</p>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Lengkap</label>
            <input
              type="text" placeholder="Masukkan nama lengkap"
              value={nama} onChange={e => setNama(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Nomor KTP</label>
            <input 
                type="text" 
                placeholder="Masukkan 16 digit No KTP"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="16"
                maxLength="16"
                // PERBAIKAN DI SINI:
                value={noKtp} 
                onChange={e => setNoKtp(e.target.value.replace(/[^0-9]/g, ''))} 
              />
          </div>
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <button
            onClick={handleDaftar} disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Mendaftar...' : 'Daftar & Masuk'}
          </button>
          <button onClick={onKembali} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
            Kembali
          </button>
        </div>
      </div>
    </div>
  )
}

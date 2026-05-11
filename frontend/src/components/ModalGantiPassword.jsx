import { useState } from 'react'
import { ADMIN_PASS, setAdminPass } from '../pages/LoginPage'

export default function ModalGantiPassword({ onBerhasil, onBatal }) {
  const [passLama,  setPassLama]  = useState('')
  const [passBaru,  setPassBaru]  = useState('')
  const [passUlang, setPassUlang] = useState('')
  const [error, setError]         = useState('')

  function handleSimpan() {
    setError('')
    if (passLama !== ADMIN_PASS) { setError('Password lama salah!'); return }
    if (passBaru.length < 4)     { setError('Password baru minimal 4 karakter!'); return }
    if (passBaru !== passUlang)  { setError('Konfirmasi password tidak cocok!'); return }
    setAdminPass(passBaru)
    onBerhasil()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1">🔑 Ganti Password</h2>
        <p className="text-gray-400 text-sm mb-5">Masukkan password lama dan password baru.</p>
        <div className="space-y-3">
          {[
            { label: 'Password Lama',             val: passLama,  set: setPassLama },
            { label: 'Password Baru',             val: passBaru,  set: setPassBaru },
            { label: 'Konfirmasi Password Baru',  val: passUlang, set: setPassUlang },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
              <input type="password" placeholder={label} value={val} onChange={e => set(e.target.value)}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
          ))}
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <button onClick={handleSimpan} className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition">
            Simpan Password Baru
          </button>
          <button onClick={onBatal} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

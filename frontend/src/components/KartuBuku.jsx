import logoPinjam from '../assets/send.png'

export default function KartuBuku({ buku, modeAdmin, dipinjamUser, diKeranjang, onPinjam, onKembalikan, onKeranjang, onHapus }) {
  const stok  = buku.stok - buku.dipinjam
  const bisa  = stok > 0
  const label = bisa ? `Tersedia (${stok})` : 'Habis'
  const warna = bisa
    ? 'text-green-700 bg-green-50 border-green-200'
    : 'text-red-600 bg-red-50 border-red-200'

  return (
    <div className="w-65 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-200">
      {/* Bagian Gambar */}
      <div className="relative">
        <img
            src={buku.gambar}
            className="w-full h-56 object-cover"
            alt={buku.judul}
            onError={(e) => { 
              // Mencegah looping infinite jika fallback ini juga gagal dimuat
              e.target.onerror = null; 
              // Mengganti via.placeholder.com dengan placehold.co yang aktif, aman, dan dinamis mengikuti judul buku
              e.target.src = `https://placehold.co/400x600/2563eb/ffffff?text=${encodeURIComponent(buku.judul)}`; 
            }}
          />
        <div className="absolute top-2 right-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${warna}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Konten Teks */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="font-bold text-gray-800 text-[11px] leading-tight line-clamp-2 mb-1 h-8">
          {buku.judul}
        </h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-3">
          📍 RAK: {buku.rak}
        </p>

        {/* Tombol Aksi */}
        <div className="mt-auto space-y-1.5">
          {modeAdmin ? (
            <button
              onClick={() => onHapus && onHapus(buku.id)}
              className="w-full text-[10px] font-bold py-2 rounded-xl transition bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border border-red-100"
            >
              🗑 Hapus Buku
            </button>
          ) : (
            <>
              {dipinjamUser ? (
                <button
                  onClick={() => onKembalikan(buku.id)}
                  className="w-full text-[10px] font-bold py-2 rounded-xl transition bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border border-red-100"
                >
                  ✕ Batal Pinjam
                </button>
              ) : (
                <button
                  onClick={() => bisa && onPinjam(buku.id)}
                  disabled={!bisa}
                  className={`w-full text-[10px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-2 ${
                    bisa 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {/* Perbaikan Ikon: Ukuran dikecilkan dan disejajarkan */}
                  <img src={logoPinjam} alt="" className={`w-3 h-3  ${!bisa && 'opacity-20'}`} />
                  Pinjam
                </button>
              )}

              {!dipinjamUser && (
                <button
                  onClick={() => bisa && onKeranjang(buku)}
                  disabled={!bisa}
                  className={`w-full text-[10px] font-bold py-2 rounded-xl transition border ${
                    diKeranjang 
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : bisa 
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {diKeranjang ? '✓ Di Keranjang' : '🛒 Keranjang'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
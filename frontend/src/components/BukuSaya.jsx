export default function BukuSaya({ listPinjaman, onKembalikan }) {
  if (listPinjaman.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <h3 className="font-bold text-gray-800 mb-4">Buku yang Kamu Pinjam</h3>
        <div className="text-center text-gray-400 py-10">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-sm">Kamu belum meminjam buku apapun.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6">
      <h3 className="font-bold text-gray-800 mb-4">Buku yang Kamu Pinjam</h3>
      <div className="flex flex-col gap-3">
        {listPinjaman.map(p => (
          <div key={p.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <img
              src={p.gambar}
              className="w-14 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
              onError={e => { e.target.src = 'https://via.placeholder.com/56x80?text=?' }}
              alt={p.judul}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{p.judul}</p>
              <p className="text-[10px] text-gray-400 uppercase mt-1">Rak: {p.rak}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Dipinjam: {new Date(p.tanggal_pinjam).toLocaleDateString('id-ID')}
              </p>
            </div>
            <button
              onClick={() => onKembalikan(p.buku_id)}
              className="text-xs font-bold bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 px-3 py-2 rounded-lg transition flex-shrink-0"
            >
              Kembalikan Buku
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TabelRiwayat({ data, loading, onKembalikan }) {
  if (loading) return <p className="text-gray-400 text-sm text-center py-4">Memuat...</p>
  if (data.length === 0) return <p className="text-gray-400 text-sm text-center py-4">Belum ada peminjaman.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 text-left">
            {['Peminjam','No. HP','No. KTP','Buku','Status','Tanggal','Aksi'].map(h => (
              <th key={h} className="p-2 border-b font-bold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            const isDipinjam = row.status === 'dipinjam'
            const tgl = new Date(row.tanggal_pinjam).toLocaleDateString('id-ID')
            return (
              <tr key={row.id} className="border-b hover:bg-slate-50">
                <td className="p-2 font-medium">{row.nama_user}</td>
                <td className="p-2 text-gray-600">{row.no_hp || '—'}</td>
                <td className="p-2 text-gray-600">{row.no_ktp || '—'}</td>
                <td className="p-2">{row.judul}</td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold border ${
                    isDipinjam ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-green-700 bg-green-50 border-green-200'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-2 text-gray-400">{tgl}</td>
                <td className="p-2">
                  {isDipinjam ? (
                    <button
                      onClick={() => onKembalikan(row.id)}
                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg font-bold transition"
                    >
                      ↩ Kembalikan
                    </button>
                  ) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

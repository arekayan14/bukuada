import logoKeranjang from '../assets/tas.png';

export default function PanelKeranjang({ show, keranjang, onHapus, onPinjamSemua, onTutup }) {
  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${show ? 'visible' : 'invisible'}`}>
      
      {/* Background Overlay: Ditambahkan efek Fade */}
      <div 
        onClick={onTutup} 
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Konten Panel: Ditambahkan efek Slide */}
      <div className={`relative h-full w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <img 
              src={logoKeranjang} 
              alt="Logo Keranjang" 
              className="w-8 h-8 object-contain" 
            />
            <h2 className="font-bold text-gray-800 text-lg">Keranjang</h2>
          </div>
          <button onClick={onTutup} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        {/* List Buku */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {keranjang.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <img 
                src={logoKeranjang} 
                alt="Logo Keranjang" 
                className="w-16 h-16 object-contain opacity-20 mb-2" 
              />  
              <p className="font-semibold text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            keranjang.map(buku => (
              <div key={buku.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                <img
                  src={buku.gambar}
                  className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                  onError={e => { e.target.src = 'https://via.placeholder.com/48x64?text=?' }}
                  alt={buku.judul}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{buku.judul}</p>
                  <p className="text-[10px] text-gray-400 uppercase mt-0.5">Rak: {buku.rak}</p>
                </div>
                <button onClick={() => onHapus(buku.id)} className="text-red-400 hover:text-red-600 text-lg flex-shrink-0">✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t">
          {keranjang.length > 0 && (
            <button
              onClick={onPinjamSemua}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
            >
              Pinjam Semua Buku
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
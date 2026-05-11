import { useState, useEffect } from 'react';
import api from '../services/api';
import KartuBuku from '../components/KartuBuku';
import PanelKeranjang from '../components/PanelKeranjang';
import Toast from '../components/Toast';

import logoKeranjang from '../assets/tas.png'; 
import logoBuku from '../assets/book.png';
import logoSetting from '../assets/setting.png';
import logoKeluar from '../assets/power-button.png';

export default function KatalogPage({ namaUser, modeAdmin, onKembaliAdmin, onKeluar }) {
    const [buku, setBuku] = useState([]);
    const [cari, setCari] = useState('');
    const [keranjang, setKeranjang] = useState([]);
    const [pinjamUser, setPinjamUser] = useState([]); 
    const [bukuSaya, setBukuSaya] = useState([]);
    const [tab, setTab] = useState('katalog');
    const [keranjangOpen, setKeranjangOpen] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => { muat(); }, []);

    const muat = async () => {
        const data = await api.getBuku();
        setBuku(data);
        if (!modeAdmin) {
            const pinjaman = await api.getPinjamanUser(namaUser);
            setPinjamUser(pinjaman.map(p => p.buku_id));
            setBukuSaya(pinjaman);
        }
    };

    const tampilToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // ... (Fungsi handlePinjam, handleBatal, dll tetap sama)
    const handlePinjam = async (bukuId) => {
        const res = await api.pinjamBuku(bukuId, namaUser);
        if (res.error) { alert(res.error); return; }
        setPinjamUser(p => [...p, bukuId]);
        setKeranjang(k => k.filter(b => b.id !== bukuId));
        setBuku(b => b.map(x => x.id === bukuId ? { ...x, dipinjam: x.dipinjam + 1 } : x));
        tampilToast('Berhasil meminjam buku!');
        const pinjaman = await api.getPinjamanUser(namaUser);
        setBukuSaya(pinjaman);
    };

    const handleBatal = async (bukuId) => {
        const res = await api.kembalikanBuku(bukuId, namaUser);
        if (res.error) { alert(res.error); return; }
        setPinjamUser(p => p.filter(id => id !== bukuId));
        setBuku(b => b.map(x => x.id === bukuId ? { ...x, dipinjam: Math.max(0, x.dipinjam - 1) } : x));
        tampilToast('Peminjaman dibatalkan.');
        const pinjaman = await api.getPinjamanUser(namaUser);
        setBukuSaya(pinjaman);
    };

    const handleKeranjang = (bukuId) => {
        const item = buku.find(b => b.id === bukuId);
        if (!item) return;
        if (keranjang.find(b => b.id === bukuId)) { alert('Sudah ada di keranjang!'); return; }
        setKeranjang(k => [...k, item]);
        tampilToast(`"${item.judul}" ditambahkan ke keranjang!`);
    };

    const handleHapus = async (id) => {
        const item = buku.find(b => b.id === id);
        if (!confirm(`Hapus buku "${item?.judul}"?`)) return;
        await api.hapusBuku(id);
        setBuku(b => b.filter(x => x.id !== id));
        tampilToast('Buku berhasil dihapus!');
    };

    const handlePinjamSemua = async () => {
        let berhasil = 0;
        for (const item of keranjang) {
            if (!pinjamUser.includes(item.id) && (item.stok - item.dipinjam) > 0) {
                const res = await api.pinjamBuku(item.id, namaUser);
                if (!res.error) { berhasil++; setPinjamUser(p => [...p, item.id]); }
            }
        }
        setKeranjang([]);
        setKeranjangOpen(false);
        await muat();
        tampilToast(`${berhasil} buku berhasil dipinjam!`);
    };

    const handleKembalikanSaya = async (pinjamId, bukuId) => {
        if (!confirm('Kembalikan buku ini?')) return;
        const res = await api.kembalikanBuku(bukuId, namaUser);
        if (res.error) { alert(res.error); return; }
        await muat();
        tampilToast('Buku berhasil dikembalikan!');
    };

    const bukuFiltered = buku.filter(b => b.judul.toLowerCase().includes(cari.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b px-6 py-3 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={logoBuku} alt="Logo" className="w-10 h-10 object-contain" />
                        <h1 className="text-blue-600 font-black text-xl tracking-tighter">BUKU ADA</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {modeAdmin ? (
                            <button onClick={onKembaliAdmin} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                                <img src={logoSetting} alt="Setting" className="w-5 h-5" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={() => setKeranjangOpen(true)} className="relative p-2 bg-amber-50 rounded-full hover:bg-amber-100 transition">
                                    <img src={logoKeranjang} alt="Keranjang" className="w-6 h-6" />
                                    {keranjang.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                            {keranjang.length}
                                        </span>
                                    )}
                                </button>
                                <div className="hidden sm:block text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Anggota</p>
                                    <p className="text-sm font-bold text-gray-800">{namaUser}</p>
                                </div>
                                <button onClick={onKeluar} className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition">
                                    <img src={logoKeluar} alt="Keluar" className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Konten Utama */}
            <div className="container mx-auto max-w-5xl">
                {!modeAdmin && (
                    <div className="px-6 py-6">
                        <div className="flex bg-white rounded-2xl shadow-sm border p-1">
                            <button onClick={() => setTab('katalog')}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'katalog' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                📚 Katalog
                            </button>
                            <button onClick={() => setTab('bukuSaya')}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${tab === 'bukuSaya' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                📖 Buku Saya
                                {bukuSaya.length > 0 && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'bukuSaya' ? 'bg-blue-400 text-white' : 'bg-red-500 text-white'}`}>
                                        {bukuSaya.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Filter Cari */}
                {(modeAdmin || tab === 'katalog') && (
                    <div className="px-6 mb-6">
                        <div className="relative">
                            <input
                                type="text" value={cari} onChange={e => setCari(e.target.value)}
                                placeholder="Cari judul buku favoritmu..."
                                className="w-full bg-white border-none shadow-sm rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                            <span className="absolute right-5 top-4 opacity-30 text-xl">🔍</span>
                        </div>
                    </div>
                )}

                {/* Grid Buku */}
                <div className="px-6 pb-20">
                    {tab === 'katalog' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {bukuFiltered.map(b => (
                                <KartuBuku
                                    key={b.id} buku={b}
                                    modeAdmin={modeAdmin}
                                    dipinjamUser={pinjamUser.includes(b.id)}
                                    diKeranjang={!!keranjang.find(k => k.id === b.id)}
                                    onPinjam={handlePinjam}
                                    onBatal={handleBatal}
                                    onKeranjang={handleKeranjang}
                                    onHapus={handleHapus}
                                />
                            ))}
                        </div>
                    ) : (
                        /* List Buku Saya */
                        <div className="space-y-4">
                            {bukuSaya.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                                    <p className="text-4xl mb-4">📭</p>
                                    <p className="text-slate-400 font-medium">Belum ada buku yang dipinjam.</p>
                                </div>
                            ) : (
                                bukuSaya.map(p => (
                                    <div key={p.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition">
                                        <img src={p.gambar} alt={p.judul} className="w-16 h-24 object-cover rounded-xl shadow-sm" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 leading-tight mb-1">{p.judul}</h4>
                                            <div className="flex gap-2 mb-2">
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">Rak {p.rak}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                📅 Dipinjam: {new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <button onClick={() => handleKembalikanSaya(p.id, p.buku_id)} 
                                            className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition group">
                                            <span className="text-xs font-bold px-2">Kembalikan</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <PanelKeranjang
                open={keranjangOpen}
                keranjang={keranjang}
                onTutup={() => setKeranjangOpen(false)}
                onHapus={(id) => setKeranjang(k => k.filter(b => b.id !== id))}
                onPinjamSemua={handlePinjamSemua}
            />

            <Toast pesan={toast} />
        </div>
    );
}